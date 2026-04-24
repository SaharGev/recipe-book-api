import { useNavigate } from "react-router-dom";
import "./PageHeader.css";

type PageHeaderProps = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightButton?: React.ReactNode;
};

export default function PageHeader({ title, showBack = true, onBack, rightButton }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="page-header">
      {showBack ? (
        <button className="page-header-back-btn" onClick={() => onBack ? onBack() : navigate(-1)}>‹</button>
      ) : (
        <div className="page-header-spacer" />
      )}
      <h1 className="page-header-title">{title}</h1>
      <div className="page-header-right">
        {rightButton || <div className="page-header-spacer" />}
      </div>
    </div>
  );
}
