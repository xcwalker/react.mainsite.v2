import { useEffect, useState } from "react";
import { TicketType } from "../../types";
import firebaseCreateData from "../../functions/firebase/storage/createData";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { useAuth } from "../../functions/firebase/authentication/useAuth";
import css from "../../styles/pages/ticket/create.module.css";
import Button from "../../components/Button";
import AccountPage from "../../components/Security/AccountPage";
import InputGroup from "../../components/InputGroup";
import { removeEmpty } from "../../functions/removeEmpty";
import devConsole from "../../functions/devConsole";
import PageSeoWrapper from "../../components/PageSeoWrapper";
import { separator, title } from "../../App";

export default function TicketCreate() {
  const [ticketData, setTicketData] = useState<TicketType>({
    data: {
      title: "",
      messages: [
        {
          content: "",
          sender: {
            id: undefined,
            name: undefined,
          },
          date: new Date().toJSON(),
        },
      ],
    },
    metaData: {
      date: {
        createdAt: new Date().toJSON(),
        updatedAt: new Date().toJSON(),
      },
      status: "open",
      priority: "unknown",
      assignee: null,
      reporter: {
        id: undefined,
        name: undefined,
        email: undefined,
      },
    },
  });

  const navigate = useNavigate();
  const currentUser = useAuth();

  useEffect(() => {
    if (currentUser) {
      setTicketData((ticketData) => ({
        data: {
          ...ticketData.data,
          messages: ticketData.data.messages.map((msg, index) => {
            if (index === 0) {
              return {
                ...msg,
                sender: {
                  id: currentUser.uid,
                  name: undefined,
                },
              };
            }
            return msg;
          }),
        },
        metaData: {
          ...ticketData.metaData,
          reporter: {
            id: currentUser.uid,
            name: undefined,
            email: undefined,
          },
        },
      }));
    } else {
      setTicketData((ticketData) => ({
        data: {
          ...ticketData.data,
          messages: ticketData.data.messages.map((msg, index) => {
            if (index === 0) {
              return {
                ...msg,
                sender: {
                  id: undefined,
                  name: ticketData.metaData.reporter.name,
                },
              };
            }
            return msg;
          }),
        },
        metaData: {
          ...ticketData.metaData,
          reporter: {
            id: undefined,
            name: ticketData.metaData.reporter.name,
            email: ticketData.metaData.reporter.email,
          },
        },
      }));
    }
  }, [currentUser]);

  const submitTicket = () => {
    // Submit ticket to firebase
    devConsole.log(ticketData);
    firebaseCreateData("tickets", {
      ...removeEmpty(ticketData),
      data: {
        ...ticketData.data,
        messages: ticketData.data.messages.map((msg) => removeEmpty(msg)),
      } as unknown,
    }).then((res) => {
      if (!res) return;

      devConsole.log(res);
      navigate("./" + res.id);
    });
  };

  return (
    <PageSeoWrapper
      title={`Create Ticket ${separator} ${title}`}
      description="
        Create a support ticket to get help with any issues or questions you may have."
    >
      <AccountPage id="create-ticket" onSubmit={() => submitTicket()}>
        <h1>Create Ticket</h1>
        <Input
          label="Title"
          value={ticketData.data.title}
          onChange={(e) =>
            setTicketData({
              ...ticketData,
              data: { ...ticketData.data, title: e.target.value },
            })
          }
          required
          id="ticket-title"
        />
        <Input
          label="Message"
          type="textarea"
          value={ticketData.data.messages[0].content}
          onChange={(e) =>
            setTicketData({
              ...ticketData,
              data: {
                ...ticketData.data,
                messages: ticketData.data.messages.map((msg, index) => {
                  if (index === 0) {
                    return { ...msg, content: e.target.value };
                  }
                  return msg;
                }),
              },
            })
          }
          required
          id="ticket-message"
        />
        {!currentUser && (
          <InputGroup direction="row" fullWidth>
            {/* Name & Email */}
            <Input
              label="Name (Optional)"
              value={ticketData.metaData.reporter.name || ""}
              onChange={(e) =>
                setTicketData({
                  ...ticketData,
                  metaData: {
                    ...ticketData.metaData,
                    reporter: {
                      ...ticketData.metaData.reporter,
                      name: e.target.value,
                    },
                  },
                })
              }
              className={css.input}
              id="ticket-name"
            />
            <Input
              label="Email (Optional)"
              type="email"
              value={ticketData.metaData.reporter.email || ""}
              onChange={(e) =>
                setTicketData({
                  ...ticketData,
                  metaData: {
                    ...ticketData.metaData,
                    reporter: {
                      ...ticketData.metaData.reporter,
                      email: e.target.value,
                    },
                  },
                })
              }
              className={css.input}
              id="ticket-email"
            />
          </InputGroup>
        )}
        <Button style="primary" type="submit" title="Submit Ticket" centered>
          Submit Ticket
        </Button>
      </AccountPage>
    </PageSeoWrapper>
  );
}
