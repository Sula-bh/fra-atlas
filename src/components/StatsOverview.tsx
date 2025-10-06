import { Card } from '@/components/ui/card';
import { FileText, MapPin, Users, TrendingUp } from 'lucide-react';

const StatsOverview = () => {
  const stats = [
    {
      icon: <FileText className="w-6 h-6" />,
      label: 'Total Claims',
      value: '45,678',
      change: '+12.5%',
      color: 'text-primary',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Granted Titles',
      value: '32,145',
      change: '+8.3%',
      color: 'text-accent',
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Beneficiaries',
      value: '1.2M',
      change: '+15.2%',
      color: 'text-secondary',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Coverage Area',
      value: '2.8M ha',
      change: '+6.7%',
      color: 'text-primary',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className={stat.color}>{stat.icon}</div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              {stat.change}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsOverview;
