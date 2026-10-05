export type MeetingStatus = 'Ongoing' | 'Pending' | 'Rescheduled' | 'Cancelled';

export interface Meeting {
  id: string;
  title: string;
  description: string;
  dateGroup: string; // e.g. 'Today, 1 May 2025' or 'Saturday, 3 May 2025'
  startTime: string; // e.g. '10:00AM'
  endTime: string; // e.g. '12:00PM'
  timezone: string; // e.g. 'UCT+7'
  timezoneName: string; // e.g. 'Western Indonesia Time'
  meetingLink: string;
  email: string;
  meetingNotes: string;
  status: MeetingStatus;
  participantsCount: string;
  createdAt: string; // e.g. 'April 12, 2025'
  isExpanded?: boolean;
}
