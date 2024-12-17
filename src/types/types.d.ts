interface AxiosResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: unknown;
  request?: unknown;
}

interface TicketCountInfo {
  totalBalance: number;
  realChatBalance: number;
  realVoiceBalance: number;
  generalChatBalance: number;
  generalVoiceBalance: number;
}

interface LicenseCounts {
  mockChat: number;
  mockVoice: number;
  realChat: number;
  realVoice: number;
}

interface GetMyPageResponse {
  data: GetMyPageInfo;
}

interface GetMyPageInfo {
  user: GetUserInfo;
  ticketInfo: TicketCountInfo;
}

interface GetTicketResponse {
  data: GetTicketUserInfo;
}

interface GetTicketUserInfo {
  userCountInfo: TicketCountInfo;
  ticketTransactionDetails: GetTicketTransactionDetail[];
}

interface GetTicketTransactionDetail {
  ticketTransactionId: number;
  amount: number;
  ticketTransactionType: string;
  ticketTransactionTypeKorean: string;
  ticketTransactionMethod: string;
  ticketTransactionMethodKorean: string;
  interviewMode: string;
  interviewModeKorean: string;
  interviewAssetType: string;
  interviewAssetTypeKorean: string;
  description: string;
  generatedAt: Date;
}

interface OwnedTicket {
  label: string;
  count: number | null | undefined;
}

interface GetPreSignedUrlResponse {
  code: number;
  message: string;
  data: PreSignedUrl;
}

interface PreSignedUrl {
  preSignedUrl: string;
  objectKey: string;
}
