import html2canvas from "html2canvas"

export class DownloadUtils {
    public static exportCurrentBody() {
        html2canvas(document.body).then(canvas => this.downloadCanvas(canvas));
    }

    private static downloadCanvas(canvas: HTMLCanvasElement){
        var link = document.createElement('a');
        link.download = 'filename.png';
        link.href = canvas.toDataURL()
        link.click();
      }
}