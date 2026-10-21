export type AmbientTrack = {
  id: string;
  label: string;
  mood: string;
  src: string;
  source: string;
  author: string;
  license: string;
};

export const ambientTracks: AmbientTrack[] = [
  { id: "rain", label: "Gentle rain", mood: "A steady rain shower", src: "/ambient/gentle-rain.ogg", source: "https://commons.wikimedia.org/wiki/File:Rain_(1).ogg", author: "ezwa", license: "Public domain" },
  { id: "fire", label: "Fireplace", mood: "A small open fire", src: "/ambient/fireplace.ogg", source: "https://commons.wikimedia.org/wiki/File:Dry_grass_burning_in_open_fireplace.ogg", author: "ezwa", license: "Public domain" },
  { id: "shore", label: "Shore waves", mood: "Water moving along a pebble beach", src: "/ambient/shore-waves.ogg", source: "https://commons.wikimedia.org/wiki/File:On_a_pebble_beach.ogg", author: "earthcalling", license: "Public domain" },
  { id: "pond", label: "Evening pond", mood: "Frogs and crickets at dusk", src: "/ambient/pond-at-dusk.ogg", source: "https://commons.wikimedia.org/wiki/File:Nature_sounds_ambience_in_a_Dordogne_pond.ogg", author: "Glaneur de sons", license: "CC BY 3.0" },
];
