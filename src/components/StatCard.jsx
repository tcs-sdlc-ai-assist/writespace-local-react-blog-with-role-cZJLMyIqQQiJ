import PropTypes from 'prop-types';

export function StatCard({ label, value, icon, bgColor }) {
  return (
    <div className={`${bgColor || 'bg-blue-500'} rounded-lg shadow-md p-6 text-white flex items-center gap-4`}>
      <div className="text-4xl flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium uppercase tracking-wide opacity-90">{label}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  bgColor: PropTypes.string,
};

StatCard.defaultProps = {
  bgColor: 'bg-blue-500',
};