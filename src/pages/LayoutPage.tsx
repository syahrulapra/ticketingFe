import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import { useAuth } from "../auth/auth";
import { useUser } from "../api/user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Route = createFileRoute("/dashboard")({
  component: LayoutComponent,
});

const queryClient = new QueryClient();

function LayoutComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  );
}

function Layout() {
  const { setAuthUser } = useAuth();
  const navigate = useNavigate({ from: "/ticket" });
  const { data: user } = useUser();
  const role = user && user.role;

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    setAuthUser(null);

    navigate({ to: "/" });
  }

  return (
    <>
      <div className="h-screen bg-neutral-100">
        <div className="w-full sticky top-0 z-50 bg-white">
          <div className="max-w-[1280px] py-2 flex justify-between m-auto">
            <h1 className="text-xl font-bold">Ticketing</h1>
            <div className="flex gap-4 items-center justify-center">
              {role === "User" ? (
                <>
                  <Link
                    to="/dashboard/ticket"
                    activeProps={{ className: "text-blue-500" }}
                  >
                    Ticket
                  </Link>
                  <Link
                    to="/dashboard/ticketanswered"
                    activeProps={{ className: "text-blue-500" }}
                  >
                    Ticket Answered
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard/ticket"
                    activeProps={{ className: "text-blue-500" }}
                  >
                    Ticket
                  </Link>
                </>
              )}
              <button onClick={() => logout()}>Logout</button>
            </div>
          </div>
        </div>
        <hr />
        <div className="p-1 flex flex-col overflow-y-auto h-screen max-h-[calc(100vh-45px)]">
          <div className="w-full overflow-auto h-full">
            <div className="max-w-[1280px] w-full m-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
