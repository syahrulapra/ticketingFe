import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Params, Priority, TicketInput } from "../api/types";
import { Select } from "./Select";
import {
  useCloseTicket,
  useCreateTicket,
  useCreateTicketAnswered,
  useDeleteTicket,
  useDetailAnsweredTicket,
  useDetailTicket,
} from "../api/ticket";
import { useUser } from "../api/user";

const options: Priority[] = ["Low", "Medium", "High"];

export function ModalCreationComponent({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [priority, setPriority] = React.useState<Priority>();

  const createTicket = useCreateTicket();
  const mutation = useMutation({
    mutationFn: (ticket: TicketInput) => createTicket(ticket),
    onError: () => {
      setIsSubmitting(false)
    }
  });

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsSubmitting(true);
    mutation.mutate({ subject, message, priority: priority || "Low" });
  };

  if (mutation.isError) {
    console.log(mutation.error.message);
  }

  if (mutation.isSuccess) {
    console.log("Berhasil");
    onClose();
    window.location.reload();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-4/12 p-4 flex flex-col gap-4">
        <h1 className="text-2xl text-black">Buat Ticket Baru</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <fieldset
            disabled={isSubmitting}
            className="w-full flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-sm font-medium">
                Subjek
              </label>
              <input
                type="text"
                className="rounded-md bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 outline-none placeholder:text-gray-400"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Masukan Subjek"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-sm font-medium">
                Pesan
              </label>
              <input
                type="text"
                className="rounded-md bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 outline-none placeholder:text-gray-400"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Masukan Pesan"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Select
                options={options}
                value={priority || "Low"}
                onChange={(value: Priority) => setPriority(value)}
              />
            </div>

            <div className="flex gap-2 justify-end w-full">
              <button
                onClick={onClose}
                className="w-2/12 bg-gray-400 text-white font-medium py-2 rounded-md"
              >
                Batal
              </button>
              <button
                type="submit"
                className="w-2/12 bg-blue-400 text-white font-medium py-2 rounded-md"
              >
                {isSubmitting ? "Loading..." : "Kirim"}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export function ModalDetailComponent({ ticket, onClose }: { 
  ticket: Params["ticket"]; 
  onClose: () => void;
}) {
  const { data: ticketDetails, isLoading } = useDetailTicket(ticket);
  const { data: user } = useUser();
  const role = user && user.role;
  const [isInputOpen, setInputOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const showInput = () => {
    setInputOpen(!isInputOpen);
  };

  const createTicketAnswered = useCreateTicketAnswered(
    ticketDetails && ticketDetails.ticketNumber
  );
  const mutation = useMutation({
    mutationFn: (ticket: Omit<TicketInput, "subject" | "priority">) =>createTicketAnswered(ticket),
    onError: () => {
      setIsSubmitting(false)
    }
  });

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsSubmitting(true);
    mutation.mutate({ message });
  };

  if (mutation.isError) {
    console.log(mutation.error.message);
  }

  if (mutation.isSuccess) {
    console.log("Berhasil");
    onClose();
    window.location.reload();
  }

  const deleteTicket = useDeleteTicket();
  const handleDelete = async () => {
    try {
      await deleteTicket(ticket);
      console.log("Tiket berhasil dihapus");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Gagal menghapus tiket", error);
    }
  };

  const closeTicket = useCloseTicket();
  const handleClose = async () => {
    try {
      await closeTicket(ticketDetails && ticketDetails.ticketNumber);
      console.log("Tiket berhasil ditutup");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Gagal menutup tiket", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-4/12 p-4 flex flex-col gap-4">
        <h1 className="text-2xl text-black">Detail Ticket</h1>
        {isLoading && (
          <div className="flex flex-col gap-4">
            <span className="rounded-md bg-gray-200 border p-5 animate-pulse"></span>
            <span className="rounded-md bg-gray-200 border p-5 animate-pulse"></span>
            <span className="rounded-md bg-gray-200 border p-5 animate-pulse"></span>
            <span className="rounded-md bg-gray-200 border p-5 animate-pulse"></span>
            <span className="rounded-md bg-gray-200 border p-5 animate-pulse"></span>
            <span className="rounded-md bg-gray-200 border p-5 animate-pulse"></span>
            <div className="flex place-self-end gap-2 w-6/12">
              <span className="w-full rounded-md bg-gray-200 border p-5 animate-pulse"></span>
              <span className="w-full rounded-md bg-gray-200 border p-5 animate-pulse"></span>
              <span className="w-full rounded-md bg-gray-200 border p-5 animate-pulse"></span>
            </div>
          </div>
        )}
        {ticketDetails && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="grup flex flex-col gap-2">
                <span className="text-sm font-medium">ID</span>
                <span className="rounded-md bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5">
                  {ticketDetails._id}
                </span>
              </div>
              <div className="grup flex flex-col gap-2">
                <span className="text-sm font-medium">Nomor Tiket</span>
                <span className="rounded-md bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5">
                  {ticketDetails.ticketNumber}
                </span>
              </div>
              <div className="grup flex flex-col gap-2">
                <span className="text-sm font-medium">Subjek</span>
                <span className="rounded-md bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5">
                  {ticketDetails.subject}
                </span>
              </div>
              <div className="grup flex flex-col gap-2">
                <span className="text-sm font-medium">Pesan</span>
                <span className="max-h-36 rounded-md bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5">
                  {ticketDetails.message}
                </span>
              </div>
              <div className="grup flex flex-col gap-2">
                <span className="text-sm font-medium">Prioritas</span>
                <span className="rounded-md bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5">
                  {ticketDetails.priority}
                </span>
              </div>
              <div className="grup flex flex-col gap-2">
                <span className="text-sm font-medium">Status</span>
                <span className="rounded-md bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5">
                  {ticketDetails.status}
                </span>
              </div>
            </div>
            {role === "Admin" && ticketDetails.status === "Open" ? (
              isInputOpen ? (
                <>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <label htmlFor="" className="text-sm font-medium">
                      Pesan Balasan
                    </label>
                    <input
                      type="text"
                      className="rounded-md bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Masukan Pesan"
                      required
                    />
                    <div className="flex gap-2 justify-end w-full">
                      <button
                        onClick={onClose}
                        className="p-4 bg-gray-400 text-sm text-white font-medium py-2 rounded-md"
                      >
                        Kembali
                      </button>
                      <button
                        type="submit"
                        className="p-4 bg-blue-400 text-sm text-white font-medium py-2 rounded-md"
                      >
                        {isSubmitting ? "loading..." : "Kirim"}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <button
                    className="w-full bg-blue-400 text-white font-medium py-2 rounded-md"
                    onClick={showInput}
                  >
                    Balas Tiket
                  </button>
                  <div className="flex gap-2 justify-end w-full">
                    <button
                      onClick={onClose}
                      className="p-4 bg-gray-400 text-sm text-white font-medium py-2 rounded-md"
                    >
                      Kembali
                    </button>
                  </div>
                </>
              )
            ) : (
              <div className="flex gap-2 justify-end w-full">
                <button
                  onClick={onClose}
                  className="p-4 bg-gray-400 text-sm text-white font-medium py-2 rounded-md"
                >
                  Kembali
                </button>
                {role !== "Admin" && (
                  <>
                    <button
                      onClick={handleClose}
                      className="p-4 bg-yellow-400 text-sm text-white font-medium py-2 rounded-md"
                    >
                      Tutup Tiket
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-4 bg-red-400 text-sm text-white font-medium py-2 rounded-md"
                    >
                      Hapus Tiket
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function ModalDetailAnsweredComponent({ ticket, onClose }: { 
  ticket: Params["ticket"]; 
  onClose: () => void;
}) {
  const { data: detailTicketAnswered, isLoading } = useDetailAnsweredTicket(ticket);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-4/12 p-4 flex flex-col gap-4">
        <h1 className="text-2xl text-black">Detail Ticket Terjawab</h1>
        {isLoading && (
          <div className="flex flex-col gap-4">
            <span className="rounded-md bg-gray-200 border p-5 animate-pulse"></span>
            <span className="rounded-md bg-gray-200 border p-5 animate-pulse"></span>
            <span className="rounded-md bg-gray-200 border p-5 animate-pulse"></span>
            <span className="rounded-md bg-gray-200 border p-5 animate-pulse"></span>
            <span className="rounded-md bg-gray-200 border p-5 animate-pulse"></span>
            <span className="rounded-md bg-gray-200 border p-5 animate-pulse"></span>
            <div className="flex place-self-end gap-2 w-6/12">
              <span className="w-full rounded-md bg-gray-200 border p-5 animate-pulse"></span>
              <span className="w-full rounded-md bg-gray-200 border p-5 animate-pulse"></span>
              <span className="w-full rounded-md bg-gray-200 border p-5 animate-pulse"></span>
            </div>
          </div>
        )}
        {detailTicketAnswered && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="grup flex flex-col gap-2">
                <span className="text-sm font-medium">Nomor Tiket</span>
                <span className="rounded-md bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5">
                  {detailTicketAnswered.tickets.ticketNumber}
                </span>
              </div>
              <div className="grup flex flex-col gap-2">
                <span className="text-sm font-medium">Subjek</span>
                <span className="rounded-md bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5">
                  {detailTicketAnswered.tickets.subject}
                </span>
              </div>
              <div className="grup flex flex-col gap-2">
                <span className="text-sm font-medium">Pesan</span>
                <span className="rounded-md bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5">
                  {detailTicketAnswered.tickets.message}
                </span>
              </div>
              <div className="grup flex flex-col gap-2">
                <span className="text-sm font-medium">Prioritas</span>
                <span className="rounded-md bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5">
                  {detailTicketAnswered.tickets.priority}
                </span>
              </div>
            </div>
            <div className="">
              <div className="grup flex flex-col gap-2">
                <span className="text-sm font-medium">Jawaban</span>
                <span className="rounded-md bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5">
                  {detailTicketAnswered.message}
                </span>
              </div>
            </div>
            <div className="flex gap-2 justify-end w-full">
              <button
                onClick={onClose}
                className="p-4 bg-gray-400 text-sm text-white font-medium py-2 rounded-md"
              >
                Kembali
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
