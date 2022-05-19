export interface CustomHTMLDivElement extends HTMLDivElement { 
  mozRequestFullScreen(): Promise<void>; 
  webkitRequestFullscreen(): Promise<void>; 
  msRequestFullscreen(): Promise<void>; 
  webkitEnterFullscreen(): Promise<void>; 
}
export interface CustomHTMLVideoElement extends HTMLVideoElement { 
  webkitEnterFullscreen(): Promise<void>; 
}