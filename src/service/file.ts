import { Provide, Inject } from '@midwayjs/core'
import { Context } from '@midwayjs/web'
import * as fs from 'fs'
import * as path from 'path'
import * as uuid from 'uuid'
import * as moment from 'moment'
import xlsx from 'node-xlsx'
const uploadDir = 'uploads'
@Provide()
export class FileService {
  @Inject()
  ctx: Context

  // 上传文件
  async upload(files: any[]) {
    const mode = await this.getMode()

    const { ctx } = this

    const fileDir = this.getUploadFolder()
    // 存储目录名称
    const dir = `${moment().format('YYYY')}/${moment().format('MM-DD')}`
    // 最终文件目录
    const url = path.join(fileDir, dir)
    const list = []
    // 如果目录不存在就创建
    if (!fs.existsSync(url)) fs.mkdirSync(url, { recursive: true })

    if (mode === 'file') {
      for (let i = 0; i < files.length; i++) {
        // 当前文件
        const file = files[i]
        // 文件后缀
        const extname: string = path.extname(file.filename).toLowerCase()

        // 根据临时路径读取文件
        const data = fs.readFileSync(file.data)
        // 生成文件名称
        const fileName = uuid.v1()
        // 文件最终路径
        const target = path.join(url, `${fileName}${extname}`)
        // 写入文件
        fs.writeFileSync(target, data)

        list.push(`${uploadDir}/${dir}/${fileName}${extname}`)
      }
      // 返回路径列表
      return list
    } else {
      // 模式为stream，一次只能上传一个文件，但参数还是一个数组
      const file = files[0]
      const extname: string = path.extname(file.filename).toLowerCase()
      // 生成文件名称
      const fileName = uuid.v1()
      const target = path.join(url, `${fileName}${extname}`)
      const writeStream = fs.createWriteStream(target)

      for await (const chunk of file.data) {
        writeStream.write(chunk)
      }

      list.push(`${uploadDir}/${dir}/${fileName}${extname}`)
    }
    return list
  }
  // 删除文件
  async removeFile(url) {
    const fileDir = this.getUploadFolder()
    // fileDir包含了uploads，如果url也包含，需要去掉其中一个
    if (url.indexOf(uploadDir) > -1) {
      url = url.replace(uploadDir, '')
    }
    const fileUrl = path.join(fileDir, url)
    // 如果文件存在删除
    if (fs.existsSync(fileUrl)) {
      fs.unlinkSync(fileUrl)
    }
    return true
  }

  // 导入excel
  async importExcel(file) {
    const [url] = await this.upload([file])

    const filePath = path.join(this.getPublicFolder(), url)

    // 解析表格数据
    const data = xlsx.parse(filePath)
    // 删除文件
    this.removeFile(url)
    return data
  }

  // 导入excel
  async exportExcel(data, fileName?) {
    const buffer = xlsx.build([{ name: 'sheet1', data }] as any)
    fileName = fileName ? fileName : moment().format('YYYY-MM-DD') + '.xlsx'
    this.ctx.attachment(fileName)
    this.ctx.status = 200
    this.ctx.body = buffer
  }

  // 获取上传文件模式 file/stream
  async getMode() {
    return this.ctx.app.config?.upload?.mode || 'file'
  }

  // 获取uploads目录
  getUploadFolder() {
    const baseDir = this.ctx.app.getBaseDir()
    return path.join(baseDir, '..', `public/${uploadDir}`)
  }

  // 获取public目录
  getPublicFolder() {
    const baseDir = this.ctx.app.getBaseDir()
    return path.join(baseDir, '..', 'public')
  }
}
