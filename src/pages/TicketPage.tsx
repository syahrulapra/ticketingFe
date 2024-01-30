import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  ModalCreationComponent,
  ModalDetailComponent,
} from "../components/Modal";
import { useTicket } from "../api/ticket";
import { useUser } from "../api/user";
import { ITicket } from "../api/types";

export const Route = createFileRoute("/ticket")({
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
  component: TicketComponent,
});

const queryClient = new QueryClient();

function TicketComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <Ticket />
    </QueryClientProvider>
  );
}

function Ticket() {
  const [page, setPage] = React.useState(1);
  const { data: tickets, isFetching } = useTicket(page);
  const [isModalCreation, setIsModalCreation] = React.useState(false);
  const [isModalDetail, setIsModalDetail] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState("");
  const { data: user } = useUser();
  const role = user && user.role;

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
      {isModalCreation && (
        <ModalCreationComponent
          onClose={() => setIsModalCreation((state) => !state)}
        />
      )}
      {isModalDetail && (
        <ModalDetailComponent
          ticket={selectedTicket}
          onClose={() => setIsModalDetail((state) => !state)}
        />
      )}
      <div className="flex justify-between my-2">
        <h1 className="text-xl">Data Ticket</h1>
        {role === "User" && (
          <button
            className="bg-blue-400 text-white p-1.5 px-2 rounded flex items-center gap-1"
            onClick={modal}
          >
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

            <span>Buat Ticket</span>
          </button>
        )}
      </div>
      <div className="text-sm text-left w-full">
        <ul className="bg-white grid grid-cols-6 gap-4 justify-items-stretch p-2.5 px-4 rounded-lg border font-semibold sticky top-0 mb-2">
          <li>No</li>
          <li>Nomor tiket</li>
          <li>Subject</li>
          <li>Prioritas</li>
          <li>Status</li>
          <li>Action</li>
        </ul>
        {tickets && tickets.length === 0 ? (
          <div className="inset-0 flex flex-col items-center justify-center h-screen max-h-[calc(100vh-200px)] border gap-2 text-base">
            <p>Data tidak ada</p>
            <button className="bg-blue-400 text-white p-1.5 px-2 rounded flex items-center">
              <button onClick={modal}>Buat Ticket</button>
            </button>
          </div>
        ) : (
          tickets && tickets.map((ticket: ITicket, index: number) => (
            <>
              <div
                className="grid grid-cols-6 gap-4 justify-items-stretch p-1.5 px-4 bg-white rounded-lg border mb-2 items-center"
                key={index}
              >
                <span>{index + 1}</span>
                <span>{ticket.ticketNumber}</span>
                <span>{ticket.subject}</span>
                {ticket.priority}
                <span
                  className={`p-1 w-20 flex justify-center items-center font-medium rounded ${
                    ticket.status === "Open"
                      ? "bg-green-100 text-green-400"
                      : ticket.status === "Answered"
                      ? "bg-yellow-100 text-yellow-400"
                      : "bg-red-100 text-red-400"
                  }`}
                >
                  {ticket.status}
                </span>
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
        <div className="flex gap-2 sticky bottom-0">
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
