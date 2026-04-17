import { Clock, CheckCircle, Package, Truck } from 'lucide-react';

type RequestStatus = 'pending' | 'approved' | 'collected' | 'delivered';

interface StatusBadgeProps {
    status: RequestStatus;
    size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<RequestStatus, { color: string; icon: any; label: string; bgColor: string }> = {
    pending: { color: 'text-yellow-800', icon: Clock, label: 'Pending', bgColor: 'bg-yellow-100' },
    approved: { color: 'text-blue-800', icon: CheckCircle, label: 'Approved', bgColor: 'bg-blue-100' },
    collected: { color: 'text-purple-800', icon: Package, label: 'Collected', bgColor: 'bg-purple-100' },
    delivered: { color: 'text-green-800', icon: Truck, label: 'Delivered', bgColor: 'bg-green-100' }
};

const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${config.bgColor} ${config.color} ${sizeClasses[size]}`}>
            <Icon size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
            {config.label}
        </span>
    );
}