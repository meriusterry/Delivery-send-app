import { RequestStatus } from '../types';
import { Clock, CheckCircle, Package, Truck } from 'lucide-react';

interface StatusBadgeProps {
  status: RequestStatus;
}

const statusConfig: Record<RequestStatus, { color: string; icon: any; label: string }> = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
  approved: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Approved' },
  collected: { color: 'bg-purple-100 text-purple-800', icon: Package, label: 'Collected' },
  delivered: { color: 'bg-green-100 text-green-800', icon: Truck, label: 'Delivered' }
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${config.color}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}