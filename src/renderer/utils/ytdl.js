import ytdl from "@microlink/youtube-dl";

export default {
  // Library management
  version,
  update,
  // Helpers
  getInfo,
  // Download
  download
};

// Library management
function version(callback) {
  callback = arguments[arguments.length - 1];
  ytdl.exec(null, ["--version"], {}, function(err, output) {
    if (err) throw err;
    if (callback) callback(output.join("\n"));
  });
}

function update(callback) {
  callback = arguments[arguments.length - 1];
  ytdl.exec(null, ["--update"], {}, function(err, output) {
    if (err) throw err;
    if (callback) callback(output[0]);
  });
}

// Helpers
function getInfo(url) {
  return new Promise((resolve, reject) => {
    ytdl.getInfo(url, [], (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}

/*function download(item, config, callback) {
  callback = arguments[arguments.length - 1];
  ytdl.exec(
    item.webpage_url,
    ["-x", "--audio-format", "mp3", "-o", config.path + "/%(title)s.%(ext)s"],
    {},
    function(err, output) {
      if (err) throw err;
      if (callback) callback(output);
    }
  );
}*/

function download(item, config) {
  var type_1_options = ["-o", config.path + "/" + item.title + ".%(ext)s"];
  var type_2_options = [
    "-x",
    "--audio-format",
    config.audio_format,
    "-o",
    config.path + "/" + item.title + ".%(ext)s"
  ];

  var options = config.type == 1 ? type_1_options : type_2_options;

  return new Promise((resolve, reject) => {
    ytdl.exec(item.webpage_url, options, {}, function(err, output) {
      if (err) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });
}

function process(queue, config, callback) {
  callback = arguments[arguments.length - 1];
  return new Promise((resolve, reject) => {
    /* ["-x", "--audio-format", "mp3", "-o", path + "/%(title)s.%(ext)s"], */
    ytdl.exec(
      item.webpage_url,
      ["-x", "--audio-format", "mp3", "-o", path + "/%(title)s.%(ext)s"],
      {},
      (err, output) => {
        if (err) () => resolve(output);
        if (callback) () => reject(err);
      }
    );
  });
}
