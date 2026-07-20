import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const segmentTranslation = {
  admin: 'Admin',
  staff: 'Staff Portal',
  dashboard: 'Dashboard',
  attendance: 'Attendance',
  leaves: 'Leave Management',
  advances: 'Advance Salary',
  purchases: 'Item Purchases',
  salaries: 'Salary Ledger',
  profile: 'Profile Details',
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If we are at root or login page, do not show breadcrumbs
  if (pathnames.length === 0 || pathnames.includes('login')) {
    return null;
  }

  const isRoleSegment = pathnames[0] === 'admin' || pathnames[0] === 'staff';

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-muted font-medium select-none mb-4 animate-fade-in" aria-label="Breadcrumb">
      {/* Home link */}
      <Link
        to="/"
        className="flex items-center hover:text-orange-500 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const translatedLabel = segmentTranslation[value] || value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            {isLast ? (
              <span className="text-orange-500 font-semibold truncate dark:text-orange-400">
                {translatedLabel}
              </span>
            ) : (
              <Link
                to={to}
                className="hover:text-orange-500 transition-colors hover:underline truncate"
              >
                {translatedLabel}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;

