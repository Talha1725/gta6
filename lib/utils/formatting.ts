export const formattingUtils = {
  currency: {
    format: (amount: number, currency: string = 'USD'): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
      }).format(amount);
    },

    formatUSD: (amount: number): string => {
      return formattingUtils.currency.format(amount, 'USD');
    },

    formatETH: (amount: number): string => {
      return `${amount.toFixed(2)} ETH`;
    }
  },

  date: {
    format: (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-US', options);
    },

    formatShort: (date: Date | string): string => {
      return formattingUtils.date.format(date, { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    },

    formatLong: (date: Date | string): string => {
      return formattingUtils.date.format(date, { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },

    formatTime: (date: Date | string): string => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    },

    formatDateTime: (date: Date | string): string => {
      return `${formattingUtils.date.formatShort(date)} at ${formattingUtils.date.formatTime(date)}`;
    }
  },

  number: {
    format: (num: number, decimals: number = 2): string => {
      return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    },

    formatCompact: (num: number): string => {
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(num);
    },

    formatPercentage: (num: number, decimals: number = 1): string => {
      return `${num.toFixed(decimals)}%`;
    }
  },

  text: {
    truncate: (text: string, maxLength: number, suffix: string = '...'): string => {
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength - suffix.length) + suffix;
    },

    capitalize: (text: string): string => {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    },

    capitalizeWords: (text: string): string => {
      return text.split(' ').map(word => formattingUtils.text.capitalize(word)).join(' ');
    },

    slugify: (text: string): string => {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
  },

  time: {
    formatDuration: (seconds: number): string => {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      if (days > 0) {
        return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
      } else if (hours > 0) {
        return `${hours}h ${minutes}m ${remainingSeconds}s`;
      } else if (minutes > 0) {
        return `${minutes}m ${remainingSeconds}s`;
      } else {
        return `${remainingSeconds}s`;
      }
    },

    formatCountdown: (targetDate: Date | string): { days: number; hours: number; minutes: number; seconds: number; isExpired: boolean } => {
      const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
      const now = new Date();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, isExpired: false };
    }
  }
}; 