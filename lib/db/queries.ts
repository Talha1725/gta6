import { db } from './index';
import { email, preorder, users } from './schema';
import { eq, desc, count, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

// Your existing email functions (unchanged)
export async function addEmailSubscriber(emailAddress: string) {
  try {
    const result = await db.insert(email).values({
      emailAddress,
    }).returning();
    return { success: true, data: result[0] };
  } catch (error) {
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return { success: false, error: 'Email already subscribed' };
    }
    return { success: false, error: 'Failed to add subscriber' };
  }
}

export async function getActiveSubscribers() {
  return await db.select().from(email)
    .where(eq(email.status, 'active'))
    .orderBy(desc(email.subscribedAt));
}

export async function unsubscribeEmail(emailAddress: string) {
  const result = await db.update(email)
    .set({ 
      status: 'unsubscribed', 
      unsubscribedAt: new Date() 
    })
    .where(eq(email.emailAddress, emailAddress))
    .returning();
  
  return result.length > 0;
}

export async function getEmailStats() {
  const [totalResult, activeResult, unsubscribedResult] = await Promise.all([
    db.select({ count: count() }).from(email),
    db.select({ count: count() }).from(email).where(eq(email.status, 'active')),
    db.select({ count: count() }).from(email).where(eq(email.status, 'unsubscribed'))
  ]);

  return {
    total: totalResult[0].count,
    active: activeResult[0].count,
    unsubscribed: unsubscribedResult[0].count,
  };
}

// UPDATED: Simple preorder functions (no email relations)
export async function createPreorderEntry(
  notes?: string, 
  selectedDate?: string, 
  releaseDate?: string | Date
) {
  try {
    const insertData: any = {};
    
    if (notes) insertData.notes = notes;
    if (selectedDate) insertData.selectedDate = selectedDate; // Keep as string for date field
    
    if (releaseDate) {
      // Ensure releaseDate is a Date object for timestamp field
      if (typeof releaseDate === 'string') {
        insertData.releaseDate = new Date(releaseDate);
      } else {
        insertData.releaseDate = releaseDate;
      }
      
      // Validate the date
      if (isNaN(insertData.releaseDate.getTime())) {
        throw new Error('Invalid release date provided');
      }
    }



    const result = await db.insert(preorder).values(insertData).returning();
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error creating preorder:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create preorder entry' 
    };
  }
}

// Get all preorders (simplified - no email joins)
export async function getAllPreorders() {
  try {
    return await db.select({
      id: preorder.id,
      notes: preorder.notes,
      selectedDate: preorder.selectedDate,
      releaseDate: preorder.releaseDate,
      createdAt: preorder.createdAt,
    })
    .from(preorder)
    .orderBy(desc(preorder.createdAt));
  } catch (error) {
    console.error('Error fetching preorders:', error);
    throw error;
  }
}

// Get latest preorder
export async function getLatestPreorder() {
  try {
    const result = await db.select({
      id: preorder.id,
      notes: preorder.notes,
      selectedDate: preorder.selectedDate,
      releaseDate: preorder.releaseDate,
      createdAt: preorder.createdAt,
    })
    .from(preorder)
    .orderBy(desc(preorder.createdAt))
    .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching latest preorder:', error);
    throw error;
  }
}

// Update preorder
// export async function updatePreorder(
//   preorderId: number, 
//   updates: {
//     notes?: string;
//     selectedDate?: string;
//     releaseDate?: string;
//   }
// ) {
//   try {
//     return await db.update(preorder)
//       .set(updates)
//       .where(eq(preorder.id, preorderId))
//       .returning();
//   } catch (error) {
//     console.error('Error updating preorder:', error);
//     throw error;
//   }
// }

// Delete preorder
export async function deletePreorder(preorderId: number) {
  try {
    return await db.delete(preorder)
      .where(eq(preorder.id, preorderId))
      .returning();
  } catch (error) {
    console.error('Error deleting preorder:', error);
    throw error;
  }
}

// Admin functions
export async function createAdmin(emailAddress: string, passwordHash: string) {
  try {
    const result = await db.insert(users).values({
      id: uuidv4(),
      email: emailAddress,
      passwordHash,
      role: 'admin',
    }).returning();
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error creating admin:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create admin' 
    };
  }
}

export async function getAdminByEmail(adminEmail: string) {
  try {
    const result = await db.select().from(users)
      .where(and(
        eq(users.email, adminEmail),
        eq(users.role, 'admin')
      ))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching admin:', error);
    return null;
  }
}

// UPDATED: Get all data for admin dashboard (no email relations)
export async function getAdminDashboardData() {
  try {
    
    const [emails, preorders, admins, stats] = await Promise.all([
      getActiveSubscribers(),
      getAllPreorders(), // Updated: no email joins
      db.select().from(users),
      getEmailStats(),
    ]);

    return {
      emails,
      preorders,
      admins,
      stats,
    };
  } catch (error) {
    console.error('❌ Error in getAdminDashboardData:', error);
    throw error;
  }
}

// Get preorder statistics
export async function getPreorderStats() {
  try {
    const [totalResult] = await Promise.all([
      db.select({ count: count() }).from(preorder)
    ]);

    return {
      total: totalResult[0].count,
    };
  } catch (error) {
    console.error('Error fetching preorder stats:', error);
    throw error;
  }
}