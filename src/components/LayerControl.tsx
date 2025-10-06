import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Layers, TreePine, Droplet, Wheat, Building2 } from 'lucide-react';

interface Layer {
  id: string;
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface LayerControlProps {
  layers: Layer[];
  onLayerToggle: (layerId: string) => void;
}

const LayerControl = ({ layers, onLayerToggle }: LayerControlProps) => {
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      forest: <TreePine className="w-4 h-4 text-primary" />,
      water: <Droplet className="w-4 h-4 text-accent" />,
      agriculture: <Wheat className="w-4 h-4 text-secondary" />,
      infrastructure: <Building2 className="w-4 h-4 text-muted-foreground" />,
    };
    return icons[iconName] || <Layers className="w-4 h-4" />;
  };

  return (
    <Card className="p-4 bg-card/95 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">Map Layers</h3>
      </div>
      <div className="space-y-3">
        {layers.map((layer) => (
          <div key={layer.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {layer.icon}
              <Label htmlFor={layer.id} className="text-sm cursor-pointer">
                {layer.label}
              </Label>
            </div>
            <Switch
              id={layer.id}
              checked={layer.enabled}
              onCheckedChange={() => onLayerToggle(layer.id)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LayerControl;
