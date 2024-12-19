let stages = [];
let items = [];
let itemUnlocks = [];

export const initData = (gameAssets) => {
    stages = gameAssets.stages.data;
    items = gameAssets.items.data;
    itemUnlocks = gameAssets.itemUnlocks.data;
}

export const getStages = () => {
    return stages;
}

export const getItems = () => {
    return items;
}

export const getItemUnlocks = () => {
    return itemUnlocks;
}