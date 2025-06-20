// app/api/subscriptions/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { db } from '@/lib/db';
import { orders } from '@/lib/db/schema';
import { eq, and, count, desc } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    // Get query parameters
    const type = searchParams.get('type') || 'all'; // 'all', 'subscriptions', 'onetime'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Validate type parameter
    if (!['all', 'subscriptions', 'onetime'].includes(type)) {
      return NextResponse.json({ success: false, error: 'Invalid type parameter' }, { status: 400 });
    }

    // Build where conditions
    let whereConditions = and(
      eq(orders.customerEmail, session.user.email),
      eq(orders.status, 'completed')
    );

    // Add purchase type filter based on type
    if (type === 'subscriptions') {
      whereConditions = and(whereConditions, eq(orders.purchaseType, 'monthly'));
    } else if (type === 'onetime') {
      whereConditions = and(whereConditions, eq(orders.purchaseType, 'one_time'));
    }

    // Get total count for pagination
    const [totalCountResult] = await db
      .select({ count: count() })
      .from(orders)
      .where(whereConditions);

    const totalCount = totalCountResult.count;

    // Get paginated orders
    const userOrders = await db
      .select()
      .from(orders)
      .where(whereConditions)
      .orderBy(desc(orders.createdAt)) // Order by most recent first
      .limit(limit)
      .offset(offset);

    if (userOrders.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNextPage: false,
          hasPrevPage: page > 1
        },
        type,
        message: `No ${type === 'all' ? 'orders' : type} found`
      });
    }

    // Transform the data to match the required format
    const transformedData = userOrders.map((order) => {
      const baseData = {
        plan: order.productName,
        status: order.status,
        amount: Number(order.amount),
        customerId: order.customerId
      };

      // Add endDate only for subscriptions (monthly purchases)
      if (order.purchaseType === 'monthly' && order.createdAt) {
        // Calculate end date (next billing date)
        const createdDate = new Date(order.createdAt);
        const endDate = new Date(createdDate);
        endDate.setMonth(endDate.getMonth() + 1);
        
        // If the day of month is different (due to month length differences),
        // set to the last day of the target month
        if (createdDate.getDate() !== endDate.getDate()) {
          endDate.setDate(0); // Set to last day of previous month
        }

        return {
          ...baseData,
          endDate: endDate.toISOString()
        };
      }

      return baseData;
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: transformedData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      type,
      message: `Successfully fetched ${type === 'all' ? 'all orders' : type}`
    });

  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}