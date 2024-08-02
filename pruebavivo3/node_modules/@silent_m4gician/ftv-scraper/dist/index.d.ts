declare function getData(): Promise<{
    id: number;
    title: string;
    iframe: string;
}[]>;

export { getData };
