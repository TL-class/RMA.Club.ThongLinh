import logger from "debug";
import { usePropertyStore } from "~/store/property";
const debug = logger("travvir:debut-nuxt:viewer:scene:TextureLoader");
class TextureLoader {
  faces = ["b", "d", "f", "l", "r", "u"];
  limiter = 100000;
  parallelLimiter = 5;
  queue = [];
  priorityQ = [];
  processed = [];
  processingQueue = false;
  constructor() {
    this.propertyStore = usePropertyStore();
  }
  getImageURLs(pattern, levelsLimit = 3) {
    try {
      // debug(pattern)
      let q = [];
      // Respect the levelsLimit to load only required zoom levels
      const maxZoom = levelsLimit;
      for (let a = 1; a <= maxZoom; a++) {
        let zUrl = pattern.replace(/\{z\}/, a);
        for (let i = 0; i < 6; i++) {
          //   debug(this.faces[i])
          let fUrl = zUrl.replace(/\{f\}/, this.faces[i]);
          for (let j = 0; j < Math.pow(2, a - 1); j++) {
            let yUrl = fUrl.replace(/\{y\}/, j);
            for (let k = 0; k < Math.pow(2, a - 1); k++) {
              let finalUrl = yUrl.replace(/\{x\}/, k);
              q.push(finalUrl);
            }
          }
        }
      }
      return q;
    } catch (e) {
      debug(e);
    }
  }
  getSceneURLs(sceneId, levelsLimit = 3) {
    try {
      let pattern = `${this.propertyStore.propertyInfo.imagePath}/${sceneId}/{z}/{f}/{y}/{x}.jpg`;
      return this.getImageURLs(pattern, levelsLimit);
    } catch (e) {
      debug(e);
    }
  }
  getPreviewURLFromId(id) {
    return `${this.propertyStore.propertyInfo.imagePath}/${id}/preview.jpg`;
  }
  getPreviewURL(pattern) {
    let parts = pattern.split("/");
    parts = parts.slice(0, parts.length - 4);
    return parts.join("/") + "/preview.jpg";
  }
  loadSceneWithConnected(data, levelsLimit = 3) {
    let images = this.getSceneURLs(data.id, levelsLimit);
    let p = [this.getPreviewURLFromId(data.id)];
    data.linkHotspots.forEach((el) => {
      let im;
      if (typeof el.target == typeof "") {
        im = this.getSceneURLs(el.target, levelsLimit);
        p.push(this.getPreviewURLFromId(el.target));
      } else {
        im = this.getSceneURLs(el.target.id, levelsLimit);
        p.push(this.getPreviewURLFromId(el.target.id));
      }
      images = images.concat(im);
    });
    this.priorityQ = p.concat(this.priorityQ);
    let filtered = images?.filter((el) => !this.processed.includes(el));
    this.queue = [...filtered];
    this.startQueue();
  }
  startQueue() {
    if (!this.processingQueue) this.processQueue();
  }
  loadImages(pattern, priority, levelsLimit = 3) {
    let preview = this.getPreviewURL(pattern);
    this.priorityQ.push(preview);
    let q = this.getImageURLs(pattern, levelsLimit);
    if (priority) this.queue = q.concat(this.queue);
    else this.queue = this.queue.concat(q);
    // debug('queue', this.queue.length, this.processingQueue)
    this.startQueue();
  }
  processQueue() {
    // debug('processing queue', this.queue.length, this.processed.length)
    if (this.priorityQ.length == 0 && this.queue.length === 0) {
      this.processingQueue = false;
      return;
    }
    if (this.processed.length >= this.limiter) return;
    this.processingQueue = true;
    const queue =
      this.priorityQ.length > 0
        ? this.priorityQ.splice(0, this.parallelLimiter)
        : this.queue.splice(0, this.parallelLimiter);
    let promises = queue.map((url) => this.loadImage(url));
    Promise.all(promises)
      .then(() => {
        this.processQueue();
      })
      .catch(() => {
        this.processQueue();
      });
  }
  loadImage(url) {
    return new Promise((resolve, reject) => {
      // debug('loading image', url)
      if (this.processed.includes(url)) return resolve();
      let img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // debug("loaded image", url);
        this.processed.push(url);
        resolve();
      };
      img.onerror = () => {
        reject();
      };
      img.src = url;
    });
  }
}

export default TextureLoader;
