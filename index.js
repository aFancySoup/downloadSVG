export function downloadSVGImage(svgElementId, name, format) {
    if (!svgElementId || !name) {
        return;
    }

    if(!format) {
        format = "svg";
    }

    const viewBox = svgElementId.getAttribute("viewBox");
    const dimensionArr = viewBox.splite(" ");
    const width = parseInt(dimensionArr[2]);
    const height = parseInt(dimensionArr[3]);

    // If you don"t set the width and height of the svgElement... it won"t work in Firefox. Go figure
    svgElementId.setAttribute("width",svgElementId.clientWidth.toString());
    svgElementId.setAttribute("height", svgElementId.clientHeight.toString());

    const xml = new XMLSerializer().serializeToString(svgElementId);
    const svgBit64 = window.btoa(xml);
    const b64Start = "data:image/svg+xml;base64,"

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const image = new Image();
    image.onload = () => {
        canvas.getContext("2d").drawImage(image,0,0,width, height);
        canvas.toBlob( blob => {
            const link = document.createElement("a");
            link.download = `${name}.${format}`;
            let url;
            if (format === "svg") {
                format = "svg+xml"
            }
            canvas.toDataURL(`image/${format}`, 1);
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(url);
        });
    };
    image.src = b64Start + svgBit64;
}