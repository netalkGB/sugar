const { request } = require('https')
const fsPromises = require('fs').promises
const fs = require('fs')
const packagejson = require('../package.json')
const token = process.env.github_token
const { name, version } = packagejson
const nameVersion = `${name}-${version}-`

const makeRequest = (options, reject, resolve) => {
  return request(options, res => {
    if (!(res.statusCode >= 200 && res.statusCode < 300)) {
      reject(new Error(`Server-side error(${res.statusCode})`))
    }
    let receiveData = null
    res.on('data', d => {
      receiveData = receiveData === null ? d : Buffer.concat([receiveData, d])
    })
    res.on('end', () => {
      resolve(receiveData)
    })
  })
}

const post = args =>
  new Promise((resolve, reject) => {
    const { data, hostname, path, token, contentType } = args
    const options = {
      hostname,
      port: 443,
      path,
      method: 'POST',
      headers: {
        'User-Agent': 'node http(s) client',
        Authorization: `token ${token}`,
        'Content-Type': contentType
      }
    }
    const req = makeRequest(options, reject, resolve)
    req.on('error', e => {
      reject(e)
    })
    if (data) {
      req.write(data)
    }
    req.end()
  })

const postFile = args =>
  new Promise((resolve, reject) => {
    const { fpath, hostname, path, token, contentType, size } = args
    const options = {
      hostname,
      port: 443,
      path,
      method: 'POST',
      headers: {
        'User-Agent': 'node http(s) client',
        Authorization: `token ${token}`,
        'Content-Type': contentType,
        'Content-Length': size
      }
    }
    const req = makeRequest(options, reject, resolve)
    req.on('error', e => {
      reject(e)
    })
    fs.createReadStream(fpath).pipe(req)
  })

const generateUploadURL = async data => {
  let hostname = 'api.github.com'
  let path = '/repos/netalkGB/mastoot/releases'
  let contentType = 'application/json'
  let resp = await post({
    data: JSON.stringify(data),
    hostname,
    path,
    token,
    contentType
  })
  resp = JSON.parse(resp.toString())
  const uploadURL = resp.upload_url.replace('{?name,label}', '')
  return uploadURL
}

const upload = async (uploadURL, fname) => {
  const splittedUploadURL = uploadURL.split('/')
  const hostname = splittedUploadURL[2]
  const path = '/' + splittedUploadURL.filter((val, idx) => idx >= 3).join('/')
  const fpath = `dist/${fname}`
  const { size } = await fsPromises.stat(fpath)
  const splittedFileName = fname.split('.')
  const extention = splittedFileName[splittedFileName.length - 1]
  const resp = await postFile({
    hostname,
    path: path + '?name=' + fname,
    token,
    contentType: extention === 'zip' ? 'application/zip' : 'application/gzip',
    fpath,
    size
  })
  return JSON.parse(resp.toString())
}

const release = async files => {
  const uploadURL = await generateUploadURL({
    tag_name: version,
    name: `${name}-${version}`,
    draft: true,
    prerelease: true
  })
  const r = await Promise.all(
    files.map(filename => upload(uploadURL, filename))
  )
  return r
}
const main = async () => {
  try {
    const files = [
      nameVersion + `linux-x64.tar.gz`,
      nameVersion + `linux-ia32.tar.gz`,
      nameVersion + `linux-armv7l.tar.gz`,
      nameVersion + `linux-arm64.tar.gz`,
      nameVersion + `win32-ia32.zip`,
      nameVersion + `win32-x64.zip`,
      nameVersion + `darwin-x64.zip`
    ]
    const result = await release(files)
    console.log(
      result.map(r => ({
        state: r.state,
        name: r.name
      }))
    )
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
