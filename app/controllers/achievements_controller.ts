import type { HttpContext } from '@adonisjs/core/http'
import cloudinary from '#config/cloudinary'
import Achievement from '#models/achievement'

export default class AchievementsController {
    public async store({ request, auth, response }: HttpContext) {
        const user = auth.user!

        const body = request.body()
        const image = request.file('image', {
            extnames: ['jpg', 'jpeg', 'png', 'webp'],
            size: '5mb',
        })

        let imageUrl: string | null = null

        if (image) {
            const upload = await cloudinary.uploader.upload(image.tmpPath!, {
                folder: 'infinite/achievements/images',
            })
            imageUrl = upload.secure_url
        }

        const achievement = await Achievement.create({
            userId: user.id,
            title: body.title,
            description: body.description,
            imageUrl: imageUrl,
            externalLink: body.external_link ?? null,
            isVisible: body.is_visible ?? true,
        })

        return response.created({
            message: 'Réussite ajoutée avec succès.',
            data: achievement,
        })
    }
    public async index({ response }: HttpContext) {
        const achievements = await Achievement.query()
            .where('is_visible', true)
            .preload('user')
            .orderBy('created_at', 'desc')

        return response.ok({ data: achievements })
    }

    /** 🔐 Réalisations de l'utilisateur connecté */
    public async mine({ auth, response }: HttpContext) {
        const user = auth.user!
        const achievements = await user.related('achievements').query().orderBy('created_at', 'desc')

        return response.ok({ data: achievements })
    }

    
    public async update({ request, params, response }: HttpContext) {
        const id = params.id
        const payload = request.only(['title', 'description', 'is_visible'])

        const achievement = await Achievement.find(id)
        if (!achievement) return response.notFound({ message: 'Réalisation non trouvée.' })

        achievement.merge(payload)
        await achievement.save()

        return response.ok({ message: 'Réalisation mise à jour.', data: achievement })
    }

    
    public async destroy({ params, response }: HttpContext) {
        const id = params.id
        const achievement = await Achievement.find(id)
        if (!achievement) return response.notFound({ message: 'Réalisation introuvable.' })

        await achievement.delete()

        return response.ok({ message: 'Réalisation supprimée avec succès.' })
    }
}