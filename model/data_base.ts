export type User = {
    id : number;
    seat: number;
    name: string;
    order: string;
    bill: string;
}

export type Order = {
    id : number;
    name: string;
    description: string;
    ingredients: string;
    price: string;
}
