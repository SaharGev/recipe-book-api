import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/AuthContext";
import CommentsSection from "../components/CommentsSection";
import PageHeader from "../components/PageHeader";
import BottomNav from "../components/BottomNav";
import { apiFetch } from "../services/apiClient";

export default function CommentsPage() {
  const { targetType, targetId } = useParams<{ targetType: "recipe" | "book"; targetId: string }>();
  const { token } = useContext(AuthContext);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = token || localStorage.getItem("accessToken");
        if (!accessToken) return;
        const res = await apiFetch("http://localhost:3000/users/me", {}, accessToken);
        const data = await res.json();
        if (res.ok) setCurrentUserId(data._id);
      } catch {}
    };
    fetchUser();
  }, [token]);

  
  return (
    <div style={{ minHeight: "100vh", background: "#fff", padding: "24px 16px 100px" }}>
      <PageHeader title="Comments" showBack={true} />
      <CommentsSection
        targetType={targetType as "recipe" | "book"}
        targetId={targetId || ""}
        currentUserId={currentUserId}
      />
      <BottomNav />
    </div>
  );
}