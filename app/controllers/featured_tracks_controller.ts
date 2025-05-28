import type { HttpContext } from '@adonisjs/core/http'
import cloudinary from '#config/cloudinary'
import FeaturedTrack from '#models/featured_track'
import { schema, rules } from '@adonisjs/validator'

export default class FeaturedTracksController {
  public async store({ request, auth, response }: HttpContext) {
    const user = auth.user!

    const validatorSchema = schema.create({
      title: schema.string([rules.maxLength(255)]),
      description: schema.string.optional({ trim: true }),
      isPublished: schema.boolean.optional(),
      image: schema.file({
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
      }),
      audio: schema.file({
        size: '50mb',
        extnames: ['mp3', 'wav', 'ogg'],
      }),
    })

    const payload = await request.validate({ schema: validatorSchema })

    // Upload Cloudinary
    const imageUpload = await cloudinary.uploader.upload(payload.image.tmpPath!, {
      folder: 'infinite/featured-tracks/images',
    })

    const audioUpload = await cloudinary.uploader.upload(payload.audio.tmpPath!, {
      resource_type: 'video',
      folder: 'infinite/featured-tracks/audio',
    })

    const track = await FeaturedTrack.create({
      userId: user.id,
      title: payload.title,
      description: payload.description,
      coverImageUrl: imageUpload.secure_url,
      audioUrl: audioUpload.secure_url,
      isPublished: payload.isPublished ?? false,
      isVisible: true, // 👈 si c’est ton comportement par défaut
    })

    return response.created({ message: 'Morceau ajouté avec succès.', data: track })
  }
  public async index({ request, response }: HttpContext) {
    const userId = request.qs().user_id
    const isPublished = request.qs().published
    const isVisible = request.qs().visible

    const query = FeaturedTrack.query().orderBy('createdAt', 'desc')

    if (userId) {
      query.where('userId', userId)
    }

    if (isPublished !== undefined) {
      query.where('isPublished', isPublished === 'true')
    }

    if (isVisible !== undefined) {
      query.where('isVisible', isVisible === 'true')
    }

    const tracks = await query

    return response.ok({ data: tracks })
  }
  public async update({ params, request, auth, response }: HttpContext) {
    const user = auth.user!
    const track = await FeaturedTrack.find(params.id)

    if (!track) {
      return response.notFound({ message: 'Morceau introuvable.' })
    }


    if (track.userId !== user.id) {
      return response.unauthorized({ message: 'Action non autorisée.' })
    }

    const body = request.body()

    // ✅ Mise à jour des champs simples
    track.title = body.title ?? track.title
    track.description = body.description ?? track.description
    track.isPublished = body.is_published ?? track.isPublished


    const imageFile = request.file('image')
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.tmpPath!, {
        folder: 'infinite/featured-tracks/images',
      })
      track.coverImageUrl = imageUpload.secure_url
    }

    // Mise à jour de l'audio (optionnelle)
    const audioFile = request.file('audio')
    if (audioFile) {
      const audioUpload = await cloudinary.uploader.upload(audioFile.tmpPath!, {
        resource_type: 'video',
        folder: 'infinite/featured-tracks/audio',
      })
      track.audioUrl = audioUpload.secure_url
    }

    await track.save()

    return response.ok({ message: 'Morceau mis à jour avec succès.', data: track })
  }
  public async destroy({ params, auth, response }: HttpContext) {
    const user = auth.user!

    const track = await FeaturedTrack.find(params.id)
    if (!track) {
      return response.notFound({ message: 'Morceau non trouvé.' })
    }

    // Seul le propriétaire ou un admin peut supprimer
    if (track.userId !== user.id && user.role !== 'admin') {
      return response.unauthorized({ message: 'Accès refusé.' })
    }

    await track.delete()

    return response.ok({ message: 'Morceau supprimé avec succès.' })
  }


}