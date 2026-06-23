import { Breadcrumbs } from '@/components/ui/breadcrubm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPropertyById } from '@/data/properties';
import EditPropertyForm from './edit-property-form';
import { notFound } from 'next/navigation';

const EditProperty = async ({ params }: { params: Promise<any> }) => {
  const paramsValue = await params;
  const property = await getPropertyById(paramsValue.propertyId);

  if (!property) {
    notFound();
  }

  console.log({ property });

  return (
    <div>
      <Breadcrumbs
        items={[
          {
            href: '/admin-dashboard',
            label: 'Dashboard',
          },
          { label: 'Edit property' },
        ]}
      />
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Edit Property</CardTitle>
        </CardHeader>
        <CardContent>
          <EditPropertyForm
            id={property.id}
            address1={property.address1}
            address2={property.address2 || ''}
            city={property.city}
            postcode={property.postcode}
            price={property.price}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            description={property.description || ''}
            status={property.status}
            images={property.images || []}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProperty;
