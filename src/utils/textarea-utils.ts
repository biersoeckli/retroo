export function caclulateTextarea(event) {
    event.srcElement.style.height = "";
    event.srcElement.style.height =
        (event.srcElement.scrollHeight > 300
            ? 300
            : event.srcElement.scrollHeight) + "px";
}