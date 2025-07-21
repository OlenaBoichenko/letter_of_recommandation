// Interface for Intern
export interface Intern {
  full_name: string;
  position_name: string;
}

// Interface for Division
export interface Division {
    id: number;
    name: string;
}

export interface DivisionsResponse {
  results: Division[];
}

// Interface for Position
export interface Position {
    id: number;
    name: string;
}

