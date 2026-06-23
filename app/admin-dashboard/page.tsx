import { Breadcrumbs } from '@/components/ui/breadcrubm';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import Link from 'next/link';
import PropertiesTable from './properties-table';
import { getProperties } from '@/data/properties';

async function AdminDashboard({
  searchParams,
}: {
  searchParams?: Promise<any>;
}) {
  const searchParamsValue = await searchParams;
  const data = await getProperties
  console.log({data})
  
  return (
    <div className="mx-auto max-w-screen-lg px-4 py-10">
      <Breadcrumbs
        items={[
          {
            label: 'Dashboard',
          },
        ]}
      />
      <h1 className="mt-6 text-4xl font-bold">Admin Dashboard</h1>
      <Button className="mt-4 flex flex-row items-center gap-2 pl-2">
        <Link
          href="admin-dashboard/new"
          className="flex items-center gap-2"
        >
          <PlusCircleIcon />
          New Property
        </Link>
      </Button>
      <PropertiesTable
        page={searchParamsValue?.page ? parseInt(searchParamsValue.page) : 1}
      />
    </div>
  );
}

export default AdminDashboard;
