import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { ModalDetailAnsweredComponent } from "../components/Modal";
import { useTicketAnswered } from "../api/ticket";
import { useUser } from "../api/user";
import { TicketAnswered } from "../api/types";

export const Route = createFileRoute("/ticketanswered")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isLogedIn) {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: TicketAnsweredComponent,
});

const queryClient = new QueryClient();

function TicketAnsweredComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Ticket />
    </QueryClientProvider>
  );
}

function Ticket() {
  const [page, setPage] = React.useState(1);
  const { data: tickets, isFetching } = useTicketAnswered(page);
  const [isModalCreation, setIsModalCreation] = React.useState(false);
  const [isModalDetail, setIsModalDetail] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState("");
  const { data: user } = useUser();
  const role = user && user.role;

  console.log(role);

  if (role === "Admin") {
    history.back();
  }

  const lihatDetail = (index: number) => {
    const ticket = tickets[index];
    setSelectedTicket(ticket._id);
    setIsModalDetail(!isModalDetail);
  };

  const modal = () => {
    setIsModalCreation(!isModalCreation);
  };

  return (
    <>
      {isModalDetail && (
        <ModalDetailAnsweredComponent
          ticket={selectedTicket}
          onClose={() => setIsModalDetail((state) => !state)}
        />
      )}
      <div className="flex justify-between my-2">
        <h1 className="text-xl">Data Ticket Terjawab</h1>
        <button className="bg-blue-400 text-white p-1.5 px-2 rounded flex items-center gap-1">
          <svg
            className="w-5 h-5 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M5 12h14m-7 7V5"
            />
          </svg>
          <button onClick={modal}>Buat Ticket</button>
        </button>
      </div>
      <div className="text-sm text-left w-full">
        <ul className="bg-white grid grid-cols-4 gap-4 justify-items-stretch p-2.5 px-4 rounded-lg border font-semibold items-center sticky top-0 mb-2">
          <li>No</li>
          <li>Nomor tiket</li>
          <li>Jawaban</li>
          <li>Aksi</li>
        </ul>
        {tickets && tickets.length === 0 ? (
          <div className="inset-0 flex flex-col items-center justify-center h-screen max-h-[calc(100vh-200px)] border bg-white gap-2 text-base mb-2">
            <p>Data tidak ada</p>
          </div>
        ) : (
          tickets && tickets.map((ticket: TicketAnswered, index: number) => (
            <>
              <div
                className=" bg-white grid grid-cols-4 gap-4 justify-items-stretch p-2.5 px-4 rounded-lg border items-center mb-2"
                key={index}
              >
                <span>{index + 1}</span>
                <span>{ticket.tickets.ticketNumber}</span>
                <span>{ticket.message}</span>
                <button
                  className="text-blue-400 font-medium text-left"
                  onClick={() => lihatDetail(index)}
                >
                  Lihat Selengkapnya
                </button>
              </div>
            </>
          ))
        )}
      </div>

      <div className="flex justify-between">
        <span>Current Page: {page}</span>
        <div className="flex gap-2">
          {isFetching ? <span> Loading...</span> : null}{" "}
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 0))}
            disabled={page === 1}
            className="bg-blue-400 text-white p-1.5 rounded"
          >
            Previous Page
          </button>{" "}
          <button
            onClick={() => setPage((old) => old + 1)}
            disabled={tickets && tickets.length < 10}
            className="bg-blue-400 text-white p-1.5 rounded"
          >
            Next Page
          </button>
        </div>
      </div>
    </>
  );
}
