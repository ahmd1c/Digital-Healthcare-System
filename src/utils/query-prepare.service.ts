import { QueryParamsDto } from './query-params.dto';
import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class QueryService {
  build<Entity>(
    qb: SelectQueryBuilder<Entity>,
    query?: QueryParamsDto,
  ): SelectQueryBuilder<Entity> {
    // Filtering

    if (!query) {
      return qb.select().orderBy('created_at', 'DESC');
    }

    if (query.specialization) {
      qb.andWhere('specialization = :specialization', {
        specialization: query.specialization,
      });
    }

    if (query.search) {
      qb.andWhere('name ILIKE :search', {
        search: `%${query.search}%`,
      });

      if (query.price) {
        this._numericFilter(qb, query, 'price');
      }
    }
    if (query.duration) {
      this._numericFilter(qb, query, 'duration');
    }

    // Field selection

    if (query.fields) {
      qb.addSelect(
        query.fields.map((field) =>
          field === 'price' || field === 'duration'
            ? `schedule_${field}`
            : field,
        ),
      );
    } else {
      qb.select();
    }

    // Sorting
    if (query.sort) {
      const sortArray = query.sort.split(',');
      for (const sort of sortArray) {
        qb.addOrderBy(sort, `${sort[0] === '-' ? 'DESC' : 'ASC'}`);
      }
    }

    // Pagination

    qb.skip(query.page ? (query.page - 1) * (query.limit || 10) : 0).take(
      query.limit || 10,
    );

    return qb;
  }

  private _numericFilter(
    qb: SelectQueryBuilder<any>,
    query: QueryParamsDto,
    field: string,
  ) {
    let sign = '=';
    let value = query[field];
    if (typeof query[field] === 'object') {
      const gte = query[field].gte;
      sign = gte ? '>=' : '<=';
      value = gte ? gte : query[field].lte;
    }
    qb.andWhere(`schedule_${field} ${sign} :${field}`, {
      [field]: value,
    });
  }
}
