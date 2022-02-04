export class RandomColorGenerator {

    public static availableColors = ['red', 'green', 'blue', 'orange', 'purple', 'pink', 'yellow', 'amber', 'lime', 'emerald', 'teal', 'cyan', 'sky', 'indigo', 'violet', 'fuchsia', 'rose'];

    public static getRadmonColor(): string {
        return this.availableColors[Math.floor(Math.random() * this.availableColors.length)];
    }
}