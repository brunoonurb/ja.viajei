/**
 * Utilitário para compressão de imagens
 * Reduz o tamanho das imagens mantendo boa qualidade para armazenamento no banco de dados
 */

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeKB?: number
}

const defaultOptions: Required<CompressionOptions> = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
  maxSizeKB: 500
}

/**
 * Redimensiona uma imagem mantendo a proporção
 */
function resizeImage(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let { width, height } = img

  // Calcula as novas dimensões mantendo a proporção
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height)
    width = width * ratio
    height = height * ratio
  }

  // Define o tamanho do canvas
  canvas.width = width
  canvas.height = height

  // Desenha a imagem redimensionada
  ctx.drawImage(img, 0, 0, width, height)

  return { width, height }
}

/**
 * Converte File para base64 comprimido
 */
export function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const opts = { ...defaultOptions, ...options }
    
    // Verifica se é uma imagem
    if (!file.type.startsWith('image/')) {
      reject(new Error('Arquivo não é uma imagem válida'))
      return
    }

    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Não foi possível criar contexto do canvas'))
      return
    }

    img.onload = () => {
      try {
        // Redimensiona a imagem
        const { width, height } = resizeImage(canvas, ctx, img, opts.maxWidth, opts.maxHeight)
        
        // Converte para blob com qualidade especificada
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Falha ao comprimir imagem'))
              return
            }

            // Verifica se o tamanho está dentro do limite
            const sizeKB = blob.size / 1024
            if (sizeKB > opts.maxSizeKB) {
              // Se ainda estiver muito grande, reduz a qualidade
              const newQuality = Math.max(0.3, opts.quality * (opts.maxSizeKB / sizeKB))
              
              canvas.toBlob(
                (newBlob) => {
                  if (!newBlob) {
                    reject(new Error('Falha ao comprimir imagem'))
                    return
                  }
                  
                  const reader = new FileReader()
                  reader.onload = () => resolve(reader.result as string)
                  reader.onerror = () => reject(new Error('Falha ao ler arquivo'))
                  reader.readAsDataURL(newBlob)
                },
                file.type,
                newQuality
              )
            } else {
              // Tamanho OK, converte para base64
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = () => reject(new Error('Falha ao ler arquivo'))
              reader.readAsDataURL(blob)
            }
          },
          file.type,
          opts.quality
        )
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => reject(new Error('Falha ao carregar imagem'))
    
    // Carrega a imagem
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Falha ao ler arquivo'))
    reader.readAsDataURL(file)
  })
}

/**
 * Calcula o tamanho aproximado de uma string base64 em KB
 */
export function getBase64SizeKB(base64: string): number {
  // Remove o prefixo "data:image/...;base64,"
  const base64Data = base64.split(',')[1]
  // Calcula o tamanho em bytes e converte para KB
  return (base64Data.length * 0.75) / 1024
}

/**
 * Compressão otimizada para fotos de viagem
 * Configurações específicas para reduzir ainda mais o tamanho
 */
export function compressPhotoForTravel(
  file: File,
  options: Partial<CompressionOptions> = {}
): Promise<string> {
  const travelOptions: CompressionOptions = {
    maxWidth: 800,
    maxHeight: 600,
    quality: 0.7,
    maxSizeKB: 200,
    ...options
  }
  
  return compressImage(file, travelOptions)
}