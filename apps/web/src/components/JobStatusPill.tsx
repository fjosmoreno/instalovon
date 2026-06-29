interface Props {
  status: string;
}

export function JobStatusPill({ status }: Props) {
  switch (status) {
    case "pending":
      return <span className="pill-pending">Pending</span>;
    case "running":
      return <span className="pill-warning">Running</span>;
    case "succeeded":
      return <span className="pill-success">Succeeded</span>;
    case "failed":
      return <span className="pill-danger">Failed</span>;
    case "cancelled":
      return <span className="pill">Cancelled</span>;
    default:
      return <span className="pill">{status}</span>;
  }
}
