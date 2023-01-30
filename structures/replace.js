const Canvas = require("@napi-rs/canvas");

const replaceHouse = async function (client, interaction, ctx, home) {
    // Floor
    if (home.FLOOR_DATA.FLOORI) {
        const floor = await Canvas.loadImage(`./assests/floor/${home.FLOOR_DATA.FLOORI}.png`);
        ctx.drawImage(floor, 0, 0, 300, 300); 
    }
    // Wall
    //// Left
    if (home.WALL_DATA.L1I) {
        const place = await Canvas.loadImage(`./assests/wallpaper/${home.WALL_DATA.L1I}.png`);
        ctx.drawImage(place, 6, 88, 37, 57)
    }
    if (home.WALL_DATA.L2I) {
        const place = await Canvas.loadImage(`./assests/wallpaper/${home.WALL_DATA.L2I}.png`);
        ctx.drawImage(place, 43, 71, 37, 57)
    }
    if (home.WALL_DATA.L3I) {
        const place = await Canvas.loadImage(`./assests/wallpaper/${home.WALL_DATA.L3I}.png`);
        ctx.drawImage(place, 79, 51, 37, 57)
    }
    if (home.WALL_DATA.L4I) {
        const place = await Canvas.loadImage(`./assests/wallpaper/${home.WALL_DATA.L4I}.png`);
        ctx.drawImage(place, 114, 32, 37, 57)
    }
    ///// Right
    if (home.WALL_DATA.R1I) {
        const place = await Canvas.loadImage(`./assests/wallpaper/${home.WALL_DATA.R1I}.png`);
        ctx.drawImage(place, 150, 34, 37, 57)
    }
    if (home.WALL_DATA.R2I) {
        const place = await Canvas.loadImage(`./assests/wallpaper/${home.WALL_DATA.R2I}.png`);
        ctx.drawImage(place, 187, 51, 37, 57)
    }
    if (home.WALL_DATA.R3I) {
        const place = await Canvas.loadImage(`./assests/wallpaper/${home.WALL_DATA.R3I}.png`);
        ctx.drawImage(place, 222, 72, 37, 57)
    }
    if (home.WALL_DATA.R4I) {
        const place = await Canvas.loadImage(`./assests/wallpaper/${home.WALL_DATA.R4I}.png`);
        ctx.drawImage(place, 258, 98, 37, 57)
    }

    // Furniture
    ////////////A
    if (home.A_DATA.A4I) {
        const a4 = await Canvas.loadImage(`./assests/furniture/${home.A_DATA.A4I}.png`);
        ctx.drawImage(a4, 119, 24, 102, 149);
    }
    if (home.A_DATA.A3I) {
        const a3 = await Canvas.loadImage(`./assests/furniture/${home.A_DATA.A3I}.png`);
        ctx.drawImage(a3, 82, 42, 102, 149);
    }
    if (home.A_DATA.A2I) {
        const a2 = await Canvas.loadImage(`./assests/furniture/${home.A_DATA.A2I}.png`);
        ctx.drawImage(a2, 45, 61, 102, 149);
    }
    if (home.A_DATA.A1I) {
        const a1 = await Canvas.loadImage(`./assests/furniture/${home.A_DATA.A1I}.png`);
        ctx.drawImage(a1, 8, 79, 102, 149);
    }

    //////////////B
    if (home.B_DATA.B4I) {
        const a4 = await Canvas.loadImage(`./assests/furniture/${home.B_DATA.B4I}.png`);
        ctx.drawImage(a4, 155, 41, 102, 149);
    }
    if (home.B_DATA.B3I) {
        const a3 = await Canvas.loadImage(`./assests/furniture/${home.B_DATA.B3I}.png`);
        ctx.drawImage(a3, 118, 60, 102, 149);
    }
    if (home.B_DATA.B2I) {
        const a2 = await Canvas.loadImage(`./assests/furniture/${home.B_DATA.B2I}.png`);
        ctx.drawImage(a2, 81, 79, 102, 149);
    }
    if (home.B_DATA.B1I) {
        const a1 = await Canvas.loadImage(`./assests/furniture/${home.B_DATA.B1I}.png`);
        ctx.drawImage(a1, 44, 97, 102, 149);
    }

    /////////////C
    if (home.C_DATA.C4I) {
        const a4 = await Canvas.loadImage(`./assests/furniture/${home.C_DATA.C4I}.png`);
        ctx.drawImage(a4, 191, 59, 102, 149);
    }
    if (home.C_DATA.C3I) {
        const a3 = await Canvas.loadImage(`./assests/furniture/${home.C_DATA.C3I}.png`);
        ctx.drawImage(a3, 154, 78, 102, 149);
    }
    if (home.C_DATA.C2I) {
        const a2 = await Canvas.loadImage(`./assests/furniture/${home.C_DATA.C2I}.png`);
        ctx.drawImage(a2, 117, 96, 102, 149);
    }
    if (home.C_DATA.C1I) {
        const a1 = await Canvas.loadImage(`./assests/furniture/${home.C_DATA.C1I}.png`);
        ctx.drawImage(a1, 80, 114, 102, 149);
    }

    ////////////D
    if (home.D_DATA.D4I) {
        const a4 = await Canvas.loadImage(`./assests/furniture/${home.D_DATA.D4I}.png`);
        ctx.drawImage(a4, 227, 77, 102, 149);
    }
    if (home.D_DATA.D3I) {
        const a3 = await Canvas.loadImage(`./assests/furniture/${home.D_DATA.D3I}.png`);
        ctx.drawImage(a3, 190, 95, 102, 149);
    }
    if (home.D_DATA.D2I) {
        const a2 = await Canvas.loadImage(`./assests/furniture/${home.D_DATA.D2I}.png`);
        ctx.drawImage(a2, 153, 113, 102, 149);
    }
    if (home.D_DATA.D1I) {
        const a1 = await Canvas.loadImage(`./assests/furniture/${home.D_DATA.D1I}.png`);
        ctx.drawImage(a1, 116, 131, 102, 149);
    }
}

module.exports = { replaceHouse };