import React from 'react';

interface Props {
  status: string;
  type: 'order' | 'shipping';
  size?: 'sm' | 'md' | 'lg';
}

const OrderStatus: React.FC<Props> = ({ status, type, size = 'md' }) => {
  const getStatusConfig = () => {
    if (type === 'order') {
      const configs = {
        payment_pending: { color: 'yellow', label: 'Payment Pending' },
        paid: { color: 'green', label: 'Paid' },
        shipped: { color: 'blue', label: 'Shipped' },
        delivered: { color: 'purple', label: 'Delivered' },
        completed: { color: 'green', label: 'Completed' },
        cancelled: { color: 'red', label: 'Cancelled' },
        disputed: { color: 'red', label: 'Disputed' }
      };
      return configs[status as keyof typeof configs] || { color: 'gray', label: status };
    } else {
      const configs = {
        not_shipped: { color: 'gray', label: 'Not Shipped' },
        shipped: { color: 'blue', label: 'Shipped' },
        in_transit: { color: 'yellow', label: 'In Transit' },
        delivered: { color: 'green', label: 'Delivered' }
      };
      return configs[status as keyof typeof configs] || { color: 'gray', label: status };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} rounded-full font-medium bg-${config.color}-100 text-${config.color}-800 border border-${config.color}-200`}>
      {config.label}
    </span>
  );
};

export default OrderStatus;
