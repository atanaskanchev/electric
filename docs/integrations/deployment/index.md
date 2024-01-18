---
title: Deployment
sidebar_position: 40
---

import DocCardList from '@theme/DocCardList';

ElectricSQL is designed for self-host, i.e.: to be deployed on your infrastructure and hosting platform of choice.

The main component to deploy is the [Electric sync service](../../api/service.md). This sits between your local-first apps and [your Postgres database](../../usage/installation/postgres.md). It's implemented in Elixir, has no special durability requirements and is typically packaged [using Docker](./docker.md).

<DocCardList />