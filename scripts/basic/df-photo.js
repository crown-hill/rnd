
/*

PhotoSource is a custom element (<photo-source>) that defines a source URL for loading
a specific photo resource, with information about the type and dimensions
of the source file.

Attributes:

src: URL to the photo file.
h: Intrinsic height of the photo in pixels.
w: Intriinsic width of hte photo in pixels.
type: MIME type of the file.

Note that the intrinsic dimensions are the actual pixel dimensions of the
bitmap image: the actual pixel dimensions you'd see in Photoshop, etc.

Example:

 <photo-source 
    src="20200916DEF_A7R4_1306-200px.jpg" 
    h="200" 
    w="133" 
    type="image/jpeg">
</photo-source>

*/

class PhotoSource extends HTMLElement {

  constructor() {
      super();

      const shadow = this.attachShadow({mode: 'open'});

  } //constructor

  connectedCallback() {
    //console.log(this.localName + " connected");
  }

  disconnectedCallback() {
    //console.log(this.localName + " removed");
  }

  adoptedCallback() {
    //console.log(this.localName + " adopted");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //console.log(this.localName + " attribute changed");
  }
  
  pixelWidth() {
    let w = this.getAttribute("w");
    return parseInt(w);
  }

  pixelHeight() {
    let h = this.getAttribute("h");
    return parseInt(h);
  }

  logicalPixelWidth() {
    let w = this.pixelWidth();
    w = w / window.devicePixelRatio;
    return w;
  }

  logicalPixelHeight() {
    let h = this.pixelHeight();
    h = h / window.devicePixelRatio;
    return h;
  }

  aspectRatio() {
    let w = this.pixelWidth();
    let h = this.pixelHeight();
    return w / h;
  }

  isLandscape() {
    let as = this.aspectRatio();
    return as > 1.0;
  }

  isPortrait() {
    let as = this.aspectRatio();
    return as < 1.0;
  }

  isSquare() {
    let as = this.aspectRatio();
    return as == 1.0;
  }

  isJPG() {
    return this.getAttribute("type") == "image/jpeg"
  }

} // PhotoSoure


customElements.define('photo-source', PhotoSource);

/*****************************************************************************/


function RoundTenths(value) {
  value = value * 10.0;
  value = Math.round(value);
  value = value / 10.0;
  return value
}

/*****************************************************************************/

/*

Photo is a custom element (<df-photo>) to add responsive images to a document,
which should convince the browser to load an image file of the best resolution
for display based on the document's viewport size, the pixel-pitch of the view
and how much space the photo takes up in the layout.

To work <df-photo> element must contain one or more <photo-source> children
followed by a single <photo-image> child, which must be the last child.

To display the photo, the element builds a shadow DOM with this structure:
<picture>
<source srcset="" type="" media="" >*
<img>
</picture>

The source children addded to the picture reflect the <image-source> children
of the <df-photo> tag, with a media query basec on the layout and viewport.

The <img> element is styled to fill it's container. Control the size and position
of the photo in the layout by setting the size of a parent block element, such as a div.

Example Usage 1

<p>Photo, Landscape, half-width</p>
<div style="width: 50%;">
<df-photo>
  <photo-source src="20201005DEF_A7R4_1740-800px.jpg" w="800" h="533" type="image/jpeg"></photo-source>
  <photo-source src="20201005DEF_A7R4_1740-1024px.jpg" w="1024" h="683" type="image/jpeg"></photo-source>
  <photo-source src="20201005DEF_A7R4_1740-3840px.jpg" w="3840" h="2560" type="image/jpeg"></photo-source>
  <photo-image></photo-image>
</df-photo>
</div>

Example shadow DOM producedd to display the phoot. This was generated on a Mac with a "retina" display,
so the window.devicePixelRatio is 2. Note that the div used for layout is 50% the page's width.

Also note that the photo has a landscape-orientation aspect ratio.

This results in the following values being used in the media query:

1) max-width is used in the media query because the long dimension of the photo is the width.
2) The dimension used in the max-width is half the instrinsic width due to the 2:1 device pixel ratio.
3) The max-width is a calculation tha multiples the photos' long dimension by 2; this is is because
 the container's width is 1/2 the height of the viewport.

<picture>
<source srcset="20201005DEF_A7R4_1740-800px.jpg 800w 533h" type="image/jpeg" media="screen and (max-width: calc(400px * 2))">
<source srcset="20201005DEF_A7R4_1740-1024px.jpg 1024w 683h" type="image/jpeg" media="screen and (max-width: calc(512px * 2))">
<source srcset="20201005DEF_A7R4_1740-3840px.jpg 3840w 2560h" type="image/jpeg" media="screen and (max-width: calc(1920px * 2))">
<source srcset="20201005DEF_A7R4_1740-3840px.jpg 3840w 2560h" type="image/jpeg">
<img src="20201005DEF_A7R4_1740-800px.jpg" style="max-width: 100%; max-height: 100%;">
</picture>

Example shadow DOM producedd to display the phoot. This was generated on a Mac with a "retina" display,

Example Usage 2

<p>Photo, Portrait, quarter height</p>
<div style="height: 25vh;">
<df-photo>
  <photo-source src="20200916DEF_A7R4_1306-200px.jpg" h="200" w="133" type="image/jpeg"></photo-source>
  <photo-source src="20200916DEF_A7R4_1306-400px.jpg" h="400" w="267" type="image/jpeg"></photo-source>
  <photo-source src="20200916DEF_A7R4_1306-800px.jpg" h="800" w="533" type="image/jpeg"></photo-source>
  <photo-source src="20200916DEF_A7R4_1306-1024px.jpg" h="1024" w="683" type="image/jpeg"></photo-source>
  <photo-source src="20200916DEF_A7R4_1306-3840px.jpg" h="3840" w="2560" type="image/jpeg"></photo-source>
  <photo-image/>
</df-photo>
</div>

Example shadow DOM producedd to display the phoot. This was generated on a Mac with a "retina" display,
so the window.devicePixelRatio is 2. Note that the div used for layout is 25% of the view's height.
Also note that the photo has a portrait-orientation aspect ratio.

This results in the following values being used in the media query:

1) max-height is used in the media query because the long dimension of the photo is the height.
2) The dimension used in the max-height is half the instrinsic height due to the 2:1 device pixel ratio.
3) The max-height is a calculation tha multiples the photos' long dimension by 4; this is is because
 the container's height is 1/4 the height of the viewport.


<picture>
<source srcset="20200916DEF_A7R4_1306-200px.jpg 133w 200h" type="image/jpeg" media="screen and (max-height: calc(100px * 4))">
<source srcset="20200916DEF_A7R4_1306-400px.jpg 267w 400h" type="image/jpeg" media="screen and (max-height: calc(200px * 4))">
<source srcset="20200916DEF_A7R4_1306-800px.jpg 533w 800h" type="image/jpeg" media="screen and (max-height: calc(400px * 4))">
<source srcset="20200916DEF_A7R4_1306-1024px.jpg 683w 1024h" type="image/jpeg" media="screen and (max-height: calc(512px * 4))">
<source srcset="20200916DEF_A7R4_1306-3840px.jpg 2560w 3840h" type="image/jpeg" media="screen and (max-height: calc(1920px * 4))">
<source srcset="20200916DEF_A7R4_1306-3840px.jpg 2560w 3840h" type="image/jpeg">
<img src="20200916DEF_A7R4_1306-200px.jpg" style="max-width: 100%; max-height: 100%;"></picture>

*/


class Photo extends HTMLElement {

  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});

    shadow.innerHTML ="<slot></slot>";

    const slot = shadow.querySelector('slot');

    slot.addEventListener('slotchange', (event) => {
      this.slotChangeCallback(event)
    })


  } //constructor

  connectedCallback() {
    //console.log(this.localName + " connected");
  }

  disconnectedCallback() {
    //console.log(this.localName + " removed");
  }

  adoptedCallback() {
    //console.log(this.localName + " adopted");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //console.log(this.localName + " attribute changed");
  }

  slotChangeCallback(event) {
      //console.log(this.localName + " slot changed!");
  }

  imageConnected(photoImage) {
    this.photoImage = photoImage
    this.buildShadowDOM();
  }

  buildShadowDOM() {

    //console.log(this.localName + " buildShadowDOM");

    const shadow = this.shadowRoot;

    const photoSources = this.querySelectorAll("photo-source");

    let photoImageWidth = this.photoImage.getAttribute("width");
    let photoImageHeight = this.photoImage.getAttribute("height");
    let photoImageMaxWidth = this.photoImage.getAttribute("max-width");
    let photoImageMaxHeight = this.photoImage.getAttribute("max-height");
    let photoImageClass = this.photoImage.getAttribute("class");

    let pictureClass = this.getAttribute("class");

    /*
    console.log("viewport width: " + window.innerWidth);
    console.log("viewport height: " + window.innerHeight);
    console.log("devicePixelRatio: " + window.devicePixelRatio);

    console.log("viewport width (device): " + window.innerWidth * window.devicePixelRatio);
    console.log("viewport height (device): " + window.innerHeight * window.devicePixelRatio);

    console.log("photo-frame width: " + this.clientWidth);
    console.log("photo-frame height: " + this.clientHeight);
    */

    let container = this.parentElement;

    /*
    console.log("container width: " + container.clientWidth);
    console.log("container height: " + container.clientHeight);

    console.log("container width (device pixels): " + container.clientWidth * window.devicePixelRatio);
    console.log("container height (device pixels): " + container.clientHeight * window.devicePixelRatio);
    */

    // What is are the container's dimensions relative the the view dimensions?

    let containerVW = container.clientWidth / window.innerWidth;
    let containerVH = container.clientHeight / window.innerHeight;

    let widthMediaMultiplier = 1.0;
    let heightMediaMultiplier = 1.0;


    // The max-width and max-height media queries query the viewport dimensions.
    // To select the designed size for the container, scale the media query.

    if (container.innerWidth != 0) {
      widthMediaMultiplier = window.innerWidth / container.clientWidth;
    }
    if (container.clientHeight != 0) {
      heightMediaMultiplier = window.innerHeight / container.clientHeight;
    }

    containerVW = RoundTenths(containerVW);
    containerVH = RoundTenths(containerVH);

    // roudd these to the nearest tenth

    widthMediaMultiplier = RoundTenths(widthMediaMultiplier);
    heightMediaMultiplier = RoundTenths(heightMediaMultiplier);
    
    
    console.log("conainerVW: " + containerVW + " media multiplier: " + widthMediaMultiplier);
    console.log("conainerVH: " + containerVH + " media multiplier: " + heightMediaMultiplier);
    

    let photoAspectRatio = 1.0;
    let isLandscape = false;
    let isPortrait = false;
    let isSquare = false;

    let pictureEl = document.createElement("picture");

    let imgEl = document.createElement("img");

    let counter = 0

    var smallestJPG = null;
    
    photoSources.forEach(photoSource => {

      /*
      console.log(photoSource);
      console.log("photoSource " + (counter));
      console.log("photoSource image-pixel size w: " + photoSource.pixelWidth() + " h: " + photoSource.pixelHeight() + " as: " + photoSource.aspectRatio() );
      console.log("photoSource logical size w: " + photoSource.logicalPixelWidth() + " h: " + photoSource.logicalPixelHeight());
      */

      photoAspectRatio = photoSource.aspectRatio();
      isLandscape = photoSource.isLandscape();
      isPortrait = photoSource.isPortrait();
      isSquare = photoSource.isSquare();

      // Buid a standard HTML source element using the photo-source.
      // Note that the h and w here are the actual pixel dimensions of the image data.

      let sourceEl = document.createElement("source");
      let srcString = photoSource.getAttribute("src") + " " + photoSource.pixelWidth() + "w " + photoSource.pixelHeight() + "h";
      //console.log(srcString);

      sourceEl.setAttribute("srcset", srcString);
      sourceEl.setAttribute("type", photoSource.getAttribute("type"));

      // For square and landscape photos, use a media query based on width,
      // and for portrait photos use a query based on the height.
      //
      // The media query px-unit value is based on two variables.
      // 1. Image dimensions in logical pixels.
      // 2. The relative size of the photo's layout container to the viewport.
      //
      // This assumes we want the photo to fill the layout conainter.
      //
      // Using a max-width media query, we can tell the browser which
      // source to select for different sized browser window sizes.
      // But if the photo is in a layout that is smaller than the viewport's
      // fullsize we need to scale the max-width value up to seleect
      // a smaller sized photo that fills the space at optimal resolution 
      //
      // For these examples
      // assume the window is full-screensize, matching the display's
      // dimensions, like on a phone or tablet, or on a laptop or desktop
      // with the browser in full-screen mode.
      //
      

      if (isSquare || isLandscape) {

          let mediaCalc = photoSource.logicalPixelWidth() + "px * " + widthMediaMultiplier;
          sourceEl.setAttribute("media", "screen and (max-width: calc(" + mediaCalc + "))");
      
        } else {
      
          let mediaCalc = photoSource.logicalPixelHeight() + "px * " + heightMediaMultiplier;
          sourceEl.setAttribute("media", "screen and (max-height: calc(" + mediaCalc + "))");
      
        }

      
      //console.log(sourceEl);

      pictureEl.appendChild(sourceEl);

     
      counter++;

      if (photoSource.isJPG()) {
        if (smallestJPG == null) {
          smallestJPG = photoSource
        } else {
          if (photoSource.pixelWidth() < smallestJPG.pixelWidth()) {
            smallestJPG = photoSource
          }
        }
      }

      if (counter == photoSources.length) {
        
        // Add the last source again, but with no media query.
        // Should be matched if none of the others match

        let lastSourceEl = document.createElement("source");
        let srcString = photoSource.getAttribute("src") + " " + photoSource.pixelWidth() + "w " + photoSource.pixelHeight() + "h";
        lastSourceEl.setAttribute("srcset", srcString);
        lastSourceEl.setAttribute("type", photoSource.getAttribute("type"));
        pictureEl.appendChild(lastSourceEl);

      }

    });

    if (smallestJPG != null) {
     imgEl.setAttribute("src", smallestJPG.getAttribute("src"));

      let imgElStyle = ""

      if (photoImageWidth) {
        imgElStyle += "width: " + photoImageWidth + ";";
      }
      if (photoImageHeight) {
        imgElStyle += "height: " + photoImageHeight + ";";
      }
      if (photoImageMaxWidth) {
        imgElStyle += "max-width: " + photoImageMaxWidth + ";";
      }
      if (photoImageMaxHeight) {
        imgElStyle += "max-height: " + photoImageMaxHeight + ";";
      }

      if (imgElStyle) {
        imgEl.setAttribute("style", imgElStyle);
      } else {
        imgEl.setAttribute("style", "width: 100%; max-height: 100vh");
      }

      if (photoImageClass) {
        imgEl.setAttribute("class", photoImageClass)
      }

    }

    pictureEl.appendChild(imgEl);
    
    shadow.appendChild(pictureEl);

  }

} // Photo

customElements.define('df-photo', Photo);

/*****************************************************************************/

/*

PhotoImage is a custom element (<photo-image>) inside a <photo> element at the
end of the list of <photo-source> elements.

*/

class PhotoImage extends HTMLElement {

constructor() {
  super();

  const shadow = this.attachShadow({mode: 'open'});

} //constructor


connectedCallback() {

  console.log(this.localName + " connected");

  console.log("parent type: " + typeof(this.parentElement));

  if (this.parentElement.localName == "df-photo") {
  
    let Photo = this.parentElement;

    if (Photo.imageConnected) {
      Photo.imageConnected(this);
    }

  }
}

disconnectedCallback() {
  console.log(this.localName + " removed");
}

adoptedCallback() {
  console.log(this.localName + " adopted");
}

attributeChangedCallback(name, oldValue, newValue) {
  console.log(this.localName + " attribute changed");
}

} // PhotoImage

customElements.define('photo-image', PhotoImage);

/*****************************************************************************/