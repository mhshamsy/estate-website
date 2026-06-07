import { Breadcrumbs } from '@/components/ui/breadcrubm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NewPropertyForm from './new-property-form';

export default function NewProperty() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { href: '/admin-dashboard', label: 'Dashboard' },
          { label: 'New Property' },
        ]}
      />
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">New Property</CardTitle>
        </CardHeader>
        <CardContent>
          <NewPropertyForm />
        </CardContent>
      </Card>
    </div>
  );
}
