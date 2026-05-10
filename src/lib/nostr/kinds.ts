export const IDIDHERE_KINDS = {
  LOCATION_TIP: 37515,    // Tippy plaatst een locatie
  CHECKIN: 37516,          // Travy checkt in
  BUCKETLIST_ITEM: 37517, // Bucketlist item (NIP-51 compatible)
  IWANT_THIS_TO: 37518,   // IWantThisTo event
  HORECA_CLAIM: 37519,    // Horeca claimt slapend account
} as const;

export type IDidHereKind = typeof IDIDHERE_KINDS[keyof typeof IDIDHERE_KINDS];

export interface LocationTipEvent {
  kind: 37515;
  content: string;
  tags: [
    ['d', string],
    ['g', string],
    ['lat', string],
    ['lon', string],
    ['name', string],
    ['t', string],
    ...(['p', string] | ['L', 'quality'] | ['l', string, 'quality'])[]
  ];
}

export interface CheckinEvent {
  kind: 37516;
  content: string;
  tags: [
    ['d', string],
    ['g', string],
    ['lat', string],
    ['lon', string],
    ['verification', '1' | '2' | '3' | '4'],
    ['goose', string],
    ['privacy', 'public' | 'friends' | 'private'],
    ...(['badge', string])[]
  ];
}

export interface BucketlistItemEvent {
  kind: 37517;
  content: string;
  tags: [
    ['d', string],
    ['e', string],
    ['privacy', 'public' | 'friends' | 'private'],
    ['status', 'todo' | 'done'],
    ...(['trip', string])[]
  ];
}
