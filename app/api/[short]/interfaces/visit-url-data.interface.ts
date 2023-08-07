export type VisitUrlData =
	| {
			longUrl: string;
			blocked: false;
	  }
	| {
			longUrl: undefined;
			blocked: true;
	  };
