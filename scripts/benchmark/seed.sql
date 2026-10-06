-- Dados de teste para medir os endpoints (BD separada: lawfirm_bench).
-- Correr DEPOIS de o backend arrancar uma vez contra a lawfirm_bench (o Hibernate cria as tabelas).
-- Os alarmes (email_supervised) são criados pela API, com o script medir-endpoints.ps1 -CriarAlarmes.

-- 50 clientes
INSERT INTO users (username, password, name, email, phone, prefix, role, creation_date)
SELECT 'cliente' || g,
       'nao-usada',
       'Cliente ' || g,
       'cliente' || g || '@exemplo.test',
       '91000' || lpad(g::text, 4, '0'),
       '+351',
       'client',
       now()
FROM generate_series(1, 50) AS g;

-- 1 caixa de correio por cliente (50)
INSERT INTO emails (email, password, alarm, valid, creation_date, client_id)
SELECT 'caixa' || u.id || '@exemplo.test', 'nao-usada', false, true, now(), u.id
FROM users u
WHERE u.role = 'client';

-- 2 tarefas por cliente (100)
INSERT INTO tasks (task, creation_date, state, user_id)
SELECT 'Tarefa ' || t || ' do cliente ' || u.id, now(), false, u.id
FROM users u
CROSS JOIN generate_series(1, 2) AS t
WHERE u.role = 'client';

-- Confirmação
SELECT 'users' AS tabela, count(*) FROM users
UNION ALL SELECT 'emails', count(*) FROM emails
UNION ALL SELECT 'tasks', count(*) FROM tasks;
