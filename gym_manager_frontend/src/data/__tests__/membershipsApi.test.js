import { membershipsApi } from '../membershipsApi';
import * as supabaseClient from '../../lib/supabaseClient';
import { createSupabaseMock } from '../../testUtils/supabaseMock';

describe('membershipsApi', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('list returns items with count and handles filters, order and range', async () => {
    const seed = {
      memberships: [
        { id: 1, member_name: 'Alice', plan_name: 'Gold', created_at: '2024-01-02', status: 'active' },
        { id: 2, member_name: 'Bob', plan_name: 'Silver', created_at: '2024-01-03', status: 'paused' },
        { id: 3, member_name: 'Charlie', plan_name: 'Gold', created_at: '2024-01-01', status: 'active' },
      ],
    };
    const mock = createSupabaseMock({ seed });
    jest.spyOn(supabaseClient, 'supabase', 'get').mockReturnValue(mock);

    const { data, count, error } = await membershipsApi.list({
      limit: 2,
      offset: 0,
      orderBy: 'created_at',
      ascending: true,
      filters: { plan_name: 'Gold' },
    });

    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
    // After filtering to Gold and ordering ascending by date, the first 2 are ids [3,1]
    expect(data.map((d) => d.id)).toEqual([3, 1]);
    expect(count).toBe(2);
  });

  test('getById returns a single row', async () => {
    const seed = { memberships: [{ id: 10, member_name: 'Dana', plan_name: 'Gold' }] };
    const mock = createSupabaseMock({ seed });
    jest.spyOn(supabaseClient, 'supabase', 'get').mockReturnValue(mock);

    const { data, error } = await membershipsApi.getById(10);
    expect(error).toBeFalsy();
    expect(data).toBeTruthy();
    expect(data.id).toBe(10);
    expect(data.member_name).toBe('Dana');
  });

  test('create inserts and returns the new row', async () => {
    const mock = createSupabaseMock({ seed: { memberships: [] } });
    jest.spyOn(supabaseClient, 'supabase', 'get').mockReturnValue(mock);

    const payload = { member_name: 'Eve', plan_name: 'Bronze', status: 'active' };
    const { data, error } = await membershipsApi.create(payload);
    expect(error).toBeFalsy();
    expect(data).toBeTruthy();
    expect(data.member_name).toBe('Eve');
    expect(data.plan_name).toBe('Bronze');
  });

  test('update patches the row and returns updated data', async () => {
    const seed = { memberships: [{ id: 5, member_name: 'Frank', plan_name: 'Silver', status: 'paused' }] };
    const mock = createSupabaseMock({ seed });
    jest.spyOn(supabaseClient, 'supabase', 'get').mockReturnValue(mock);

    const { data, error } = await membershipsApi.update(5, { status: 'active' });
    expect(error).toBeFalsy();
    expect(data).toBeTruthy();
    expect(data.status).toBe('active');
  });

  test('remove deletes a row and returns no error', async () => {
    const seed = { memberships: [{ id: 7, member_name: 'Gina', plan_name: 'Gold' }] };
    const mock = createSupabaseMock({ seed });
    jest.spyOn(supabaseClient, 'supabase', 'get').mockReturnValue(mock);

    const { error } = await membershipsApi.remove(7);
    expect(error).toBeFalsy();
  });
});
