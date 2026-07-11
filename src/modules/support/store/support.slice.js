// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   contactSupportApi,
//   getMyTicketsApi,
//   getMyTicketByIdApi,
//   replyToTicketApi,
//   deleteTicketApi,
// } from "../services/support.api";

// export const createSupportTicket = createAsyncThunk(
//   "support/createTicket",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await contactSupportApi(payload);
//       return res;
//     } catch (e) {
//       return rejectWithValue(
//         e.response?.data?.message || "Failed to create ticket",
//       );
//     }
//   },
// );

// export const deleteTicket = createAsyncThunk(
//   "support/deleteTicket",
//   async (ticketId, { rejectWithValue }) => {
//     try {
//       const res = await deleteTicketApi(ticketId);
//       return { ticketId, ...res };
//     } catch (e) {
//       return rejectWithValue(e.response?.data?.message || "Failed to delete");
//     }
//   },
// );

// export const fetchMyTickets = createAsyncThunk(
//   "support/fetchMyTickets",
//   async ({ page, limit, search, status, category } = {}, { rejectWithValue }) => {
//     try {
//       // Pass the new filters directly to your API function
//       const response = await getMyTicketsApi(page, limit, search, status, category);

//       if (response && response.success) {
//         return {
//           tickets: response.data || [],
//           pagination: {
//             page: response.pagination.page,
//             limit: response.pagination.limit,
//             total: response.pagination.total,
//             totalPages: response.pagination.totalPages,
//           },
//           kpiStats: {
//             totalTickets: response.kpiStats.totalTickets,
//             openTickets: response.kpiStats.openTickets,
//             inProgressTickets: response.kpiStats.inProgressTickets,
//             resolvedTickets: response.kpiStats.resolvedTickets,
//             closedTickets: response.kpiStats.closedTickets,
//           },
//         };
//       }
//       return rejectWithValue(response.message || "Failed to fetch users");
//     } catch (e) {
//       return rejectWithValue(
//         e.response?.data?.message || "Failed to fetch tickets",
//       );
//     }
//   },
// );

// export const fetchTicketById = createAsyncThunk(
//   "support/fetchTicketById",
//   async (ticketId, { rejectWithValue }) => {
//     try {
//       const res = await getMyTicketByIdApi(ticketId);
//       return res?.data;
//     } catch (e) {
//       return rejectWithValue(
//         e.response?.data?.message || "Failed to fetch ticket",
//       );
//     }
//   },
// );

// export const adminReplyToTicket = createAsyncThunk(
//   "support/adminReply",
//   async (payload, { rejectWithValue }) => {
//     try {
//       let data = payload;
//       // If it's not already FormData and has attachments, convert it
//       if (!(payload instanceof FormData) && payload.attachments) {
//         data = new FormData();
//         data.append("ticketId", payload.ticketId);
//         data.append("reply", payload.reply);
//         data.append("status", payload.status);
//         payload.attachments.forEach((file) => {
//           data.append("attachments", file);
//         });
//       }
//       const res = await replyToTicketApi(data);
//       return res;
//     } catch (e) {
//       return rejectWithValue(e.response?.data?.message || "Failed to reply");
//     }
//   },
// );

// const supportSlice = createSlice({
//   name: "support",
//   initialState: {
//     tickets: [],
//     selectedTicket: null,
//     loading: false,
//     error: null,
//     successMessage: null,
//     pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
//     kpiStats: {
//       totalTickets: 0,
//       openTickets: 0,
//       inProgressTickets: 0,
//       resolvedTickets: 0,
//       closedTickets: 0,
//     },
//   },
//   reducers: {
//     setPagination: (state, action) => {
//       state.pagination.page = action.payload.page;
//       state.pagination.limit = action.payload.limit;
//     },
//     clearSupportStatus: (state) => {
//       state.successMessage = null;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createSupportTicket.pending, (s) => {
//         s.loading = true;
//         s.error = null;
//         s.successMessage = null;
//       })
//       .addCase(createSupportTicket.fulfilled, (s, a) => {
//         s.loading = false;
//         s.successMessage = a.payload?.message || "Ticket submitted";
//       })
//       .addCase(createSupportTicket.rejected, (s, a) => {
//         s.loading = false;
//         s.error = a.payload;
//       })

//       .addCase(fetchMyTickets.pending, (s) => {
//         s.loading = true;
//         s.error = null;
//       })
//       .addCase(fetchMyTickets.fulfilled, (s, a) => {
//         s.loading = false;
//         s.tickets = a.payload.tickets || [];
//         s.pagination = a.payload.pagination;
//         s.kpiStats = a.payload.kpiStats;
//       })
//       .addCase(fetchMyTickets.rejected, (s, a) => {
//         s.loading = false;
//         s.error = a.payload;
//       })

//       .addCase(fetchTicketById.pending, (s) => {
//         s.loading = true;
//         s.error = null;
//       })
//       .addCase(fetchTicketById.fulfilled, (s, a) => {
//         s.loading = false;
//         s.selectedTicket = a.payload || null;
//       })
//       .addCase(fetchTicketById.rejected, (s, a) => {
//         s.loading = false;
//         s.error = a.payload;
//       })

//       .addCase(adminReplyToTicket.pending, (s) => {
//         s.loading = true;
//         s.error = null;
//         s.successMessage = null;
//       })
//       .addCase(adminReplyToTicket.fulfilled, (s, a) => {
//         s.loading = false;
//         s.successMessage = a.payload?.message || "Reply sent";

//         // If backend returns the updated ticket, use it
//         if (a.payload?.data) {
//           const updatedTicket = a.payload.data;
//           s.selectedTicket = updatedTicket;

//           if (s.tickets && s.tickets.length > 0) {
//             const index = s.tickets.findIndex(
//               (t) => t._id === updatedTicket._id,
//             );
//             if (index !== -1) {
//               s.tickets[index] = updatedTicket;
//             }
//           }
//         } else if (a.meta && a.meta.arg) {
//           // Fallback to optimistic update if no data returned
//           const { ticketId, reply, status } = a.meta.arg;
//           const now = new Date().toISOString();

//           if (s.selectedTicket && s.selectedTicket._id === ticketId) {
//             if (status) s.selectedTicket.status = status;
//             if (reply !== undefined) {
//               s.selectedTicket.adminReply = reply;
//               s.selectedTicket.updatedAt = now;
//             }
//           }

//           if (s.tickets && s.tickets.length > 0) {
//             const ticketIndex = s.tickets.findIndex((t) => t._id === ticketId);
//             if (ticketIndex !== -1) {
//               if (status) s.tickets[ticketIndex].status = status;
//               if (reply !== undefined) {
//                 s.tickets[ticketIndex].adminReply = reply;
//                 s.tickets[ticketIndex].updatedAt = now;
//               }
//             }
//           }
//         }
//       })
//       .addCase(adminReplyToTicket.rejected, (s, a) => {
//         s.loading = false;
//         s.error = a.payload;
//       })
//       .addCase(deleteTicket.pending, (s) => {
//         s.loading = true;
//         s.error = null;
//       })
//       .addCase(deleteTicket.fulfilled, (s, a) => {
//         s.loading = false;
//         s.successMessage = a.payload?.message || "Ticket deleted";
//         s.tickets = s.tickets.filter((t) => t._id !== a.payload.ticketId);
//       })
//       .addCase(deleteTicket.rejected, (s, a) => {
//         s.loading = false;
//         s.error = a.payload;
//       });
//   },
// });

// export const { setPagination, clearSupportStatus } = supportSlice.actions;
// export default supportSlice.reducer;
