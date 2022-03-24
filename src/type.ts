export enum ConnectionLineType {
  CURVED = 'curved',
  DIRECT = 'direct',
  RECTILINEAR = 'rectilinear',
}

export type MapTree = {
  title: string
  children: MapTree[]
}

export type LineType = {
  color: string
  isAnimate: boolean
  type: ConnectionLineType
}
