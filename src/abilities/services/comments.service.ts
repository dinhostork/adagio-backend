import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { Abilities } from '../models/abilities.entitiy';
import { AddCommentDto } from '../dtos/add-comment.dto';
import { AbilitiesComments } from '../models/abilitycomments.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { AbilitiesService } from './abilities.service';
import STRINGS from 'src/constants/strings';
@Injectable()
export class AbilitiesCommentsService {
  constructor(
    @InjectRepository(AbilitiesComments)
    private readonly commentsRespository: Repository<AbilitiesComments>,
    private readonly abilityService: AbilitiesService,

    @InjectRepository(Abilities)
    private readonly ablityRepository: Repository<Abilities>,
  ) {}

  async add(data: AddCommentDto, user: Users, ability: Abilities) {
    return this.commentsRespository.save({
      ...data,
      author: user,
      ability,
    });
  }

  async getByAbilities(
    abilityid: number,
    options: IPaginationOptions,
    user: Users,
  ) {
    const qb = this.commentsRespository.createQueryBuilder('comments');
    const ability = await this.abilityService.getById(abilityid);

    const data = qb
      .leftJoinAndMapMany(
        'comments.author',
        'comments.author',
        'author',
        'comments.authorId = author.id',
      )
      .where(`abilityId = ${abilityid}`);

    const abBelongsToUser = this.ablityRepository.find({
      relations: {
        user: true,
      },
      where: {
        id: abilityid,
        user: {
          id: user.id,
        },
      },
    });

    if ((!ability.can_comment && abBelongsToUser) || ability.can_comment) {
      return paginate<AbilitiesComments>(data, options);
    }
    throw new BadRequestException(STRINGS.comments_abiitities_not_seen);
  }

  async deleteById(id: number, user: Users) {
    const commentBelongsToUserOrisAuthor = await this.commentsRespository
      .createQueryBuilder('comments')
      .leftJoin('abilities', 'abilities', 'comments.abilityId = abilities.id')
      .where(
        `comments.id = ${id} AND (comments.author = ${user.id} OR abilities.userId = ${user.id})`,
      )
      .select()
      .getOne();

    if (!commentBelongsToUserOrisAuthor) {
      throw new BadRequestException(STRINGS.action_not_permitted);
    }

    this.commentsRespository
      .createQueryBuilder('comments')
      .delete()
      .from(AbilitiesComments)
      .where(`id = ${id}`)
      .execute();

    throw new HttpException('', 204);
  }

  async updateById(id: number, author: Users, comment: string) {
    const qb = await this.commentsRespository
      .createQueryBuilder('comments')
      .update({
        comment,
      })

      .where({
        id,
        author: {
          id: author.id,
        },
      })
      .execute();

    if (qb.affected < 1) {
      throw new BadRequestException(STRINGS.action_not_permitted);
    }

    const commentToReturn = await this.commentsRespository.findBy({ id });

    return commentToReturn;
  }
}
