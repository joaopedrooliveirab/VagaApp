import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';
import { publicationLabels, type Job } from '../features/jobs/jobs';

import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { Tag } from './Tag';

type JobCardProps = {
  job: Job;
  onPress: () => void;
  showPublicationStatus?: boolean;
};

export function JobMeta({
  icon,
  text,
}: {
  icon: IconName;
  text: string;
}) {
  return (
    <View style={styles.meta}>
      <Icon name={icon} color={colors.muted} size={18} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

export function CompanyMark({ company }: { company: string }) {
  return (
    <View
      style={styles.mark}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Text style={styles.markText}>
        {company.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

export function JobCard({ job, onPress, showPublicationStatus = false }: JobCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <CompanyMark company={job.company} />

        <View style={styles.headerText}>
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.company}>{job.company}</Text>
        </View>
      </View>

      <View style={styles.metaGroup}>
        <JobMeta icon="location" text={job.location} />
        <JobMeta icon="mode" text={job.mode} />
        <JobMeta icon="level" text={job.level} />
      </View>

      <View style={styles.tags}>
        {job.skills.map((skill) => (
          <Tag key={skill} label={skill} />
        ))}
      </View>

      <Tag label="Vaga demonstrativa" variant="outline" />

      {showPublicationStatus && <Tag label={publicationLabels[job.publicationStatus]} />}

      <Button title="Ver vaga" onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    gap: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  headerText: {
    flex: 1,
    gap: 2,
  },

  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },

  company: {
    color: colors.muted,
    fontSize: 15,
  },

  mark: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  markText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },

  metaGroup: {
    gap: 8,
  },

  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  metaText: {
    color: colors.text,
    fontSize: 15,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
