import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const DataPanel = () => {
  const recentClaims = [
    { id: 'FRA-2024-001', village: 'Bhilwara', type: 'IFR', status: 'Approved', area: '3.2 ha' },
    { id: 'FRA-2024-002', village: 'Khunti', type: 'CFR', status: 'Pending', area: '12.5 ha' },
    { id: 'FRA-2024-003', village: 'Dantewada', type: 'CR', status: 'Approved', area: '8.7 ha' },
    { id: 'FRA-2024-004', village: 'Bastar', type: 'IFR', status: 'Under Review', area: '4.1 ha' },
  ];

  const schemes = [
    { name: 'PM-KISAN', beneficiaries: '2,345', coverage: '78%' },
    { name: 'Jal Jeevan Mission', beneficiaries: '1,876', coverage: '65%' },
    { name: 'MGNREGA', beneficiaries: '3,210', coverage: '92%' },
  ];

  return (
    <Card className="h-full bg-card/95 backdrop-blur-sm flex flex-col">
      <Tabs defaultValue="claims" className="h-full flex flex-col p-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="claims">Recent Claims</TabsTrigger>
          <TabsTrigger value="schemes">CSS Benefits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="claims" className="flex-1 mt-4 overflow-hidden">
          <ScrollArea className="h-full px-2">
            <div className="space-y-3">
              {recentClaims.map((claim) => (
                <div key={claim.id} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm text-card-foreground">{claim.id}</p>
                      <p className="text-xs text-muted-foreground">{claim.village}</p>
                    </div>
                    <Badge variant={claim.status === 'Approved' ? 'default' : 'secondary'}>
                      {claim.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Type: {claim.type}</span>
                    <span>Area: {claim.area}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="schemes" className="flex-1 mt-4 overflow-hidden">
          <ScrollArea className="h-full px-2">
            <div className="space-y-3">
              {schemes.map((scheme) => (
                <div key={scheme.name} className="p-3 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm text-card-foreground">{scheme.name}</p>
                    <Badge variant="outline">{scheme.coverage}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {scheme.beneficiaries} beneficiaries
                  </p>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: scheme.coverage }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DataPanel;
