import { asset } from "./apps";

const cover = (p) => `${import.meta.env.BASE_URL}icons/covers/${p}`;

export const ALBUMS = [
    { id: "enhypen", title: "ENHYPEN", cover: cover("thesinbliss.jpg"), url: "https://enhypen.lnk.to/THESINBLISS" },
    { id: "evan", title: "EVAN", cover: cover("deathofme.jpg"), url: "https://evan.lnk.to/DEATHOFME" },
];

