export interface Preorder {
  id: number;
  notes: string | null;
  selectedDate: string | null;
  releaseDate: string | null;
  createdAt: string;
}

export interface FormData {
  notes: string;
  selectedDate: string;
}

export interface PreorderCreateRequest {
  notes: string;
  selectedDate: string;
}

export interface PreorderResponse {
  success: boolean;
  preorder?: Preorder;
  message?: string;
  error?: string;
} 